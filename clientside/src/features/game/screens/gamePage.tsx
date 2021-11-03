import {
    useLayoutEffect,
    useReducer,
    useState,
    MouseEvent,
} from "react";
import { useHistory } from "react-router";
import { Position, Side } from "../../board/types/utility";
import { initialGameState } from "../constants/state";
import { GameStateContext } from "../contexts/gameStateContext";
import { MetaPhase } from "../types/state";
import Board from "../../board";
import Result from "../../result";
import styled from "styled-components";
import useQuery from "../../routing/hooks/useQuery";
import gameStateReducer from "../reducers/gameStateReducer";
import SetupModal from "../../setup";
import useAutoWithdraw from "../functions/useAutoWithdraw";
import HostWelcome from "./hostWelcome";
import AvatarVersus from "../../avatar/components/avatarVersus";
import socket from "../../../api/socketClient";
import serializePos from "../../board/functions/serializePos";
import deserializePos from "../../board/functions/deserializePos";
import deserializeBattleship from "../functions/deserializeBattleship";

import { useUserContext } from "../../lobby/contexts/userContext";
import { useOnStartSingle } from "../functions/useOnStart";
import { useOnEndSingle } from "../functions/useOnEnd";
import { useOnShoot } from "../functions/useOnShoot";
import { BoardSquareStatus } from "../../board/types/board";
import { useOnAvatar } from "../functions/useOnAvatar";
import { BattleshipAllyYard } from "../../board/types/battleship";
import { useOnShipDestroyed } from "../functions/useOnShipDestroyed";
import { useOnChat } from "../functions/useOnChat";
import useChatQueue from "../../avatar/hooks/useChatQueue";
import { AvatarProperties, AvatarSide } from "../../avatar/types/avatar";
import { ChatContext } from "../contexts/chatContext";
import Chatbox from "../components/chatBox";

const GamePage = () => {
    const [yourTurn, setYourTurn] = useState(false);
    const [phase, setPhase] = useState(MetaPhase.Welcome);
    const [state, dispatch] = useReducer(gameStateReducer, initialGameState);

    const [, setRoundWinner] = useState<"Host" | "Guest" | undefined>();
    const [allyScore, setAllyScore] = useState(0);
    const [enemyScore, setEnemyScore] = useState(0);
    const [enemyAvatarSeed, setEnemyAvatarSeed] = useState<string>("");
    const [enemyUsername, setEnemyUsername] = useState<string>("");

    const { battleship } = state;
    const { username, userAvatarSeed } = useUserContext();

    const query = useQuery();
    const history = useHistory();
    const forceWithdraw = useAutoWithdraw()[1];
    const playerChatQueue = useChatQueue();
    const enemyChatQueue = useChatQueue();

    const roomId = query.get("roomId");
    const isHost = query.get("isHost") === "true";
    const yourSide = isHost ? "Host" : "Guest";

    const combinedAvatarProps: Record<AvatarSide, AvatarProperties> = {
        left: {
            seed: isHost ? userAvatarSeed : enemyAvatarSeed,
            username: isHost ? username : enemyUsername,
            score: phase !== MetaPhase.Welcome ? 5 : undefined,
        },
        right: {
            seed: isHost ? enemyAvatarSeed : userAvatarSeed,
            username: isHost ? enemyUsername : username,
            score: phase !== MetaPhase.Welcome ? 5 : undefined,
        },
    };


    const onShoot = async (pos: Position, _e: MouseEvent) => {
        if (!yourTurn) return;
        const serialized = serializePos(pos);
        await socket.shoot(serialized);
    };

    const onSubmit = (shipyard: BattleshipAllyYard) => {
        dispatch({ type: "GAME_START", payload: { shipyard } });
        setPhase(MetaPhase.Playing);
    };

    useOnStartSingle((r) => r.firstPlayer === yourSide && setYourTurn(true));

    useOnEndSingle(
        ({ responseStatus, previousRoundWinner, hostScore, guestScore }) => {
            console.log({
                responseStatus,
                previousRoundWinner,
                hostScore,
                guestScore,
            });
            switch (responseStatus) {
                case "Withdrew":
                    return forceWithdraw();
                case "Abandoned":
                case "Destroyed":
                    setRoundWinner(previousRoundWinner as any);
                    setAllyScore(isHost ? hostScore : guestScore);
                    setEnemyScore(isHost ? guestScore : hostScore);
                    return setPhase(MetaPhase.Finish);
                default:
                    console.log({ responseStatus });
            }
        }
    );

    useOnAvatar(({ hostAvatar, guestAvatar, hostUsername, guestUsername }) => {
        setEnemyAvatarSeed(isHost ? guestAvatar : hostAvatar);
        setEnemyUsername(isHost ? guestUsername : hostUsername);
    });

    useOnChat((msg) => {
        enemyChatQueue.addMessage(msg);
    });

    useOnShoot((r) => {
        let status;
        switch (r.responseStatus) {
            case "Hit":
                status = BoardSquareStatus.Hit;
                break;
            case "Miss":
                status = BoardSquareStatus.Missed;
                break;
            default:
                return;
        }

        if (!r.location) return;
        const side = r.currentTurnPlayer === yourSide ? Side.Enemy : Side.Ally;
        const position = deserializePos(r.location);

        if (r.nextTurnPlayer === yourSide) setYourTurn(true);
        else setYourTurn(false);

        dispatch({
            type: "MARK_SQUARE",
            payload: {
                side,
                position,
                status,
            },
        });
    });

    useOnShipDestroyed(({ side, ship }) => {
        dispatch({
            type: "SUNK_SHIP",
            payload: {
                battleship: deserializeBattleship(ship),
                side: side === yourSide ? Side.Ally : Side.Enemy,
            },
        });
    });

    useLayoutEffect(() => {
        if (!roomId) {
            history.push("/welcome");
            return;
        }

        if (!isHost) {
            socket.joinRoom(username, roomId);
            socket.setAvatar(userAvatarSeed);
        }
    }, [history, isHost, roomId, username, userAvatarSeed]);

    if (phase === MetaPhase.Welcome)
        return (
            <HostWelcome
                onHostStartCallback={() => setPhase(MetaPhase.Setup)}
                avatarVersusComponent={
                    <AvatarVersus
                        {...combinedAvatarProps}
                    />
                }
            />
        );

    const avatar = (
        <AvatarVersus {...combinedAvatarProps} />
    );

    const board = isHost ? (
        <BoardContainer>
            <Board
                selectable={false}
                boardType={Side.Ally}
                shipYard={battleship.ally}
            />
            <Board
                selectable={yourTurn}
                boardType={Side.Enemy}
                shipYard={battleship.enemy}
                onSquareClick={onShoot}
            />
        </BoardContainer>
    ) : (
        <BoardContainer>
            <Board
                selectable={yourTurn}
                boardType={Side.Enemy}
                shipYard={battleship.enemy}
                onSquareClick={onShoot}
            />
            <Board
                selectable={false}
                boardType={Side.Ally}
                shipYard={battleship.ally}
            />
        </BoardContainer>
    );
    
    return (
        <ChatContext.Provider
            value={{
                chatSide:
                    yourSide === "Host" ? AvatarSide.Left : AvatarSide.Right,
                left: isHost ? playerChatQueue : enemyChatQueue,
                right: isHost ? enemyChatQueue : playerChatQueue,
            }}
        >
            <GameStateContext.Provider value={{ state, dispatch }}>
                {avatar}
                <Result />
                {phase !== MetaPhase.Finish && board}
                {phase === MetaPhase.Finish && <Result />}
                {phase === MetaPhase.Setup && <Backdrop />}
                {phase === MetaPhase.Setup && <SetupModal onSubmit={onSubmit} />}
                <Chatbox />
            </GameStateContext.Provider>

        </ChatContext.Provider>
    );
};

const BoardContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 6.9375rem;

    margin-top: 4.3125rem;
    margin-bottom: 2.75rem;
`;

const Backdrop = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.6);
`;

export default GamePage;
