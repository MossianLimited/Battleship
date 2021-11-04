import { useLayoutEffect, useReducer, useState, MouseEvent } from "react";
import { useHistory } from "react-router";
import { Position, Side } from "../../board/types/utility";
import { initialGameState } from "../constants/state";
import { GameStateContext } from "../contexts/gameStateContext";
import { Phase } from "../types/state";
import Board from "../../board";
import Result from "../../result";
import styled from "styled-components";
import useQuery from "../../routing/hooks/useQuery";
import gameStateReducer from "../reducers/gameStateReducer";
import SetupModal from "../../setup";
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
import { useOnStatistics } from "../functions/useOnStatistics";
import { StatResponse } from "../../../api/types/transport";

const GamePage = () => {
    const [yourTurn, setYourTurn] = useState(false);
    const [phase, setPhase] = useState(Phase.Welcome);
    const [state, dispatch] = useReducer(gameStateReducer, initialGameState);

    const [, setEndReason] = useState<string>();
    const [winners, setWinners] = useState<("Host" | "Guest")[]>([]);
    const [allyScore, setAllyScore] = useState(0);
    const [enemyScore, setEnemyScore] = useState(0);
    const [enemyAvatarSeed, setEnemyAvatarSeed] = useState<string>("");
    const [enemyUsername, setEnemyUsername] = useState<string>("");
    const [statistic, setStatistic] = useState<StatResponse[]>([]);

    const { battleship } = state;
    const { username, userAvatarSeed } = useUserContext();

    const query = useQuery();
    const history = useHistory();
    const playerChatQueue = useChatQueue();
    const enemyChatQueue = useChatQueue();

    const roomId = query.get("roomId");
    const isHost = query.get("isHost") === "true";
    const yourSide = isHost ? "Host" : "Guest";

    const avatarProps: Record<AvatarSide, AvatarProperties> = {
        left: {
            seed: isHost ? userAvatarSeed : enemyAvatarSeed,
            username: isHost ? username : enemyUsername,
            score: phase !== Phase.Welcome ? (isHost ? allyScore : enemyScore) : undefined,
        },
        right: {
            seed: isHost ? enemyAvatarSeed : userAvatarSeed,
            username: isHost ? enemyUsername : username,
            score: phase !== Phase.Welcome ? (isHost ? enemyScore : allyScore) : undefined,
        },
    };

    const onShoot = async (pos: Position, _e: MouseEvent) => {
        if (!yourTurn) return;
        const serialized = serializePos(pos);
        await socket.shoot(serialized);
    };

    const onSubmit = (shipyard: BattleshipAllyYard) => {
        dispatch({ type: "GAME_START", payload: { shipyard } });
        setPhase(Phase.Playing);
    };

    const onOneMoreRound = (_e: MouseEvent) => {
        if (phase !== Phase.Finish) return;
        dispatch({ type: "RESET_BOARD" });
        if (winners[winners.length - 1] === yourSide) setYourTurn(true);
        setPhase(Phase.Setup);
    };

    const onWithdraw = (_e: MouseEvent) => {
        socket.withdraw(); 
    };

    useOnStartSingle((r) => {
        r.firstPlayer === yourSide && setYourTurn(true);
    });

    useOnEndSingle(
        ({ responseStatus, previousRoundWinner, hostScore, guestScore }) => {
            switch (responseStatus) {
                case "Reset by Admin":
                    dispatch({ type: "RESET_BOARD" });   
                    setPhase(Phase.Welcome); 
                    setAllyScore(0); 
                    setEnemyScore(0); 
                    setWinners([]) 
                    return setStatistic([]); 
                case "Closed by Admin":
                case "Withdrew":
                case "Abandoned":
                case "Destroyed":
                default: 
                    setEndReason(responseStatus);
                    setPhase(Phase.Finish);
                    setAllyScore(isHost ? hostScore : guestScore);
                    setEnemyScore(isHost ? guestScore : hostScore);
                    return setWinners([...winners, previousRoundWinner as any]);
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
        console.log({ side, ship });
        dispatch({
            type: "SUNK_SHIP",
            payload: {
                battleship: deserializeBattleship(ship),
                side: side === yourSide ? Side.Ally : Side.Enemy,
            },
        });
    });

    useOnStatistics((r) => {
        setStatistic((prev) => [...prev, r]);
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

    if (phase === Phase.Welcome)
        return (
            <HostWelcome
                onHostStartCallback={() => setPhase(Phase.Setup)}
                avatarVersusComponent={<AvatarVersus {...avatarProps} />}
            />
        );

    const borderRadius = phase === Phase.Finish ? "12px 12px 0 0" : "12px";
    const avatar = <AvatarVersus style={{ borderRadius }} {...avatarProps} />;
    const result = <Result winners={winners} stats={statistic} />;

    const chat = {
        chatSide: yourSide === "Host" ? AvatarSide.Left : AvatarSide.Right,
        left: isHost ? playerChatQueue : enemyChatQueue,
        right: isHost ? enemyChatQueue : playerChatQueue,
    };

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

    const footer = (
        <Footer>
            <Withdraw onClick={onWithdraw}>Withdraw</Withdraw>
            <OneMoreRound onClick={onOneMoreRound}>One More Round</OneMoreRound>
        </Footer>
    );

    return (
        <ChatContext.Provider value={chat}>
            <GameStateContext.Provider value={{ state, dispatch }}>
                {avatar}
                {phase !== Phase.Finish && board}
                {phase === Phase.Finish && result}
                <Chatbox />
                {phase === Phase.Finish && footer}
                {phase === Phase.Setup && <Backdrop />}
                {phase === Phase.Setup && <SetupModal onSubmit={onSubmit} />}
            </GameStateContext.Provider>
        </ChatContext.Provider>
    );
};

export default GamePage;

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

const Footer = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 1rem;
    min-width: 38.9375rem;
`;

const OneMoreRound = styled.button`
    outline: none;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.375rem 0.5rem;
    background: #ffdbb4;
    color: #674def;
    text-transform: uppercase;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transform: scale(1, 1);

    &:hover {
        transform: scale(1.03, 1.06);
    }

    &:active {
        transform: scale(0.97, 0.94);
    }
`;

const Withdraw = styled(OneMoreRound)`
    background: #8972ff;
    color: white;
    font-weight: 500;
    letter-spacing: 0.5px;
`;
