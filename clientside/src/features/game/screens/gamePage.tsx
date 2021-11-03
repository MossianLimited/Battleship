import { useLayoutEffect, useReducer, useState, MouseEvent } from "react";
import { useHistory } from "react-router";
import { Position, Side } from "../../board/types/utility";
import { initialGameState } from "../constants/state";
import { GameStateContext } from "../contexts/gameStateContext";
import { MetaPhase } from "../types/state";
import Board from "../../board";
import styled from "styled-components";
import useQuery from "../../routing/hooks/useQuery";
import gameStateReducer from "../reducers/gameStateReducer";
import SetupModal from "../../setup";
import useAutoWithdraw from "../functions/useAutoWithdraw";
import HostWelcome from "./hostWelcome";
import AvatarVersus from "../../avatar/components/avatarVersus";
import socket from "../../../api/socketClient";
import deserializePos from "../../board/functions/deserializePos";
import serializePos from "../../board/functions/serializePos";

import { useUserContext } from "../../lobby/contexts/userContext";
import { useOnStartSingle } from "../functions/useOnStart";
import { useOnEndSingle } from "../functions/useOnEnd";
import { useOnShoot } from "../functions/useOnShoot";
import { BoardSquareStatus } from "../../board/types/board";
import { useOnAvatar } from "../functions/useOnAvatar";
import { BattleshipAllyYard } from "../../board/types/battleship";

const GamePage = () => {
    const [yourTurn, setYourTurn] = useState(false);
    const [phase, setPhase] = useState(MetaPhase.Welcome);
    const [state, dispatch] = useReducer(gameStateReducer, initialGameState);

    const [, setRoundWinner] = useState<'Host' | 'Guest' | undefined>(); 
    const [allyScore, setAllyScore] = useState(0); 
    const [enemyScore, setEnemyScore] = useState(0); 
    const [enemyAvatarSeed, setEnemyAvatarSeed] = useState<string>("");
    const [enemyUsername, setEnemyUsername] = useState<string>("");

    const { battleship } = state;
    const { username, userAvatarSeed } = useUserContext();

    const query = useQuery();
    const history = useHistory();
    const forceWithdraw = useAutoWithdraw()[1];

    const roomId = query.get("roomId");
    const isHost = query.get("isHost") === "true";
    const yourSide = isHost ? "Host" : "Guest";

    const userAndSeedProps = {
        leftAvatarSeed: isHost ? userAvatarSeed : enemyAvatarSeed,
        leftAvatarUsername: isHost ? username : enemyUsername,
        rightAvatarSeed: isHost ? enemyAvatarSeed : userAvatarSeed,
        rightAvatarUsername: isHost ? enemyUsername : username,
    };

    const scoreAndChatProps =
        phase === MetaPhase.Welcome
            ? {}
            : {
                  leftScore: allyScore,
                  rightScore: enemyScore,
                  leftChatFeed: "It's not a silly little moment",
                  rightChatFeed: "It's not the storm before the calm",
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

    switch (phase) {
        case MetaPhase.Welcome:
            return (
                <HostWelcome
                    onHostStartCallback={() => setPhase(MetaPhase.Setup)}
                    avatarVersusComponent={
                        <AvatarVersus
                            {...userAndSeedProps}
                            {...scoreAndChatProps}
                        />
                    }
                />
            );
        case MetaPhase.Setup:
            return (
                <GameStateContext.Provider value={{ state, dispatch }}>
                    <AvatarVersus
                        {...userAndSeedProps}
                        {...scoreAndChatProps}
                    />
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
                    <Backdrop />
                    <SetupModal onSubmit={onSubmit} />
                </GameStateContext.Provider>
            );
        case MetaPhase.Playing:
            return (
                <GameStateContext.Provider value={{ state, dispatch }}>
                    <AvatarVersus
                        {...userAndSeedProps}
                        {...scoreAndChatProps}
                    />
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
                </GameStateContext.Provider>
            );
        default:
            return null;
    }
};

const BoardContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 6.9375rem;

    margin-top: 4.3125rem;
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
