import {
    useLayoutEffect,
    useReducer,
    useState,
    MouseEvent,
    useRef,
    useEffect,
} from "react";
import { useHistory } from "react-router";
import { Position, Side } from "../../board/types/utility";
import { initialGameState } from "../constants/state";
import { GameStateContext } from "../contexts/gameStateContext";
import { Phase } from "../types/state";
import Board from "../../board";
import Result from "../../result";
import styled, { css } from "styled-components";
import useQuery from "../../routing/hooks/useQuery";
import gameStateReducer from "../reducers/gameStateReducer";
import SetupModal from "../../setup";
import HostWelcome from "./hostWelcome";
import AvatarVersus from "../../avatar/components/avatarVersus";
import Chatbox from "../components/chatBox";
import socket from "../../../api/socketClient";
import serializePos from "../../board/functions/serializePos";
import deserializePos from "../../board/functions/deserializePos";
import deserializeBattleship from "../functions/deserializeBattleship";
import useChatQueue from "../../avatar/hooks/useChatQueue";
import useAutoWithdraw from "../functions/useAutoWithdraw";
import useSound from "use-sound";

import { useUserContext } from "../../lobby/contexts/userContext";
import { useOnStart } from "../functions/useOnStart";
import { useOnEnd } from "../functions/useOnEnd";
import { useOnShoot } from "../functions/useOnShoot";
import { BoardSquareStatus } from "../../board/types/board";
import { useOnAvatar } from "../functions/useOnAvatar";
import { BattleshipAllyYard } from "../../board/types/battleship";
import { useOnShipDestroyed } from "../functions/useOnShipDestroyed";
import { useOnChat } from "../functions/useOnChat";
import { AvatarProperties, AvatarSide } from "../../avatar/types/avatar";
import { ChatContext } from "../contexts/chatContext";
import { useOnStatistics } from "../functions/useOnStatistics";
import { StatResponse } from "../../../api/types/transport";
import TutorialWrapper from "../wrappers/tutorialWrapper";
import { Backdrop } from "../../lobby/components/base.styled";
import VolumeMute from "../components/volumeMute";
import VolumeUp from "../components/volumeUp";
import useStickyState from "../functions/useStickyState";
import { useOnAdminSpectate } from "../functions/useOnAdminSpectate";

const GamePage = () => {
    const [yourTurn, setYourTurn] = useState(false);
    const [phase, setPhase] = useState(Phase.Welcome);
    const [state, dispatch] = useReducer(gameStateReducer, initialGameState);

    const [second, setSecond] = useState(10);
    const [turn, setTurn] = useState(1);

    const [mute, setMute] = useStickyState(false, "soundMute");
    const [endReason, setEndReason] = useState<string>();
    const [, setRound] = useState(0);
    const [winners, setWinners] = useState<("Host" | "Guest")[]>([]);
    const [allyScore, setAllyScore] = useState(0);
    const [allyHit, setAllyHit] = useState(0);
    const [enemyHit, setEnemyHit] = useState(0);
    const [enemyScore, setEnemyScore] = useState(0);
    const [enemyAvatarSeed, setEnemyAvatarSeed] = useState<string>("");
    const [enemyUsername, setEnemyUsername] = useState<string>("");
    const [statistic, setStatistic] = useState<StatResponse[]>([]);

    const { battleship } = state;
    const { username, userAvatarSeed, isAdmin } = useUserContext();

    const timerRef = useRef<NodeJS.Timeout | undefined>(undefined);
    const forceWithdraw = useAutoWithdraw()[1];
    const statsLock = useRef(false);
    const query = useQuery();
    const history = useHistory();
    const playerChatQueue = useChatQueue();
    const enemyChatQueue = useChatQueue();

    const roomId = query.get("roomId");
    const isHost = query.get("isHost") === "true";
    const yourSide = isHost ? "Host" : "Guest";
    const spectatorMode = query.get("spectator") === "true" && isAdmin;

    const option = { volume: 0.6, soundEnabled: !mute };
    const [playShootHit] = useSound("/sounds/shoot-hit.wav", option);
    const [playShootFire] = useSound("/sounds/shoot-fire.wav", option);
    const [playChat] = useSound("/sounds/notification-chat.wav", option);

    const [playMatchmake] = useSound(
        "/sounds/notification-matchmake.wav",
        option
    );

    const [playDefeat, { stop: stopDefeat }] = useSound(
        "/sounds/result-defeat.wav",
        option
    );

    const [playVictory, { stop: stopVictory }] = useSound(
        "/sounds/result-victory.wav",
        option
    );

    const [playPlanning, { stop: stopPlanning }] = useSound(
        "/sounds/atmosphere-planning.wav",
        { ...option, volume: 0.35, interrupt: false }
    );

    const [playPlaying, { stop: stopPlaying }] = useSound(
        "/sounds/atmosphere-playing.wav",
        { ...option, volume: 0.35, interrupt: false }
    );

    const avatarProps: Record<AvatarSide, AvatarProperties> = {
        left: {
            seed: isHost ? userAvatarSeed : enemyAvatarSeed,
            username: isHost ? username : enemyUsername,
            score:
                phase !== Phase.Welcome
                    ? isHost
                        ? allyScore
                        : enemyScore
                    : undefined,
        },
        right: {
            seed: isHost ? enemyAvatarSeed : userAvatarSeed,
            username: isHost ? enemyUsername : username,
            score:
                phase !== Phase.Welcome
                    ? isHost
                        ? enemyScore
                        : allyScore
                    : undefined,
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
        playPlanning();

        if (phase !== Phase.Finish) return;
        dispatch({ type: "RESET_BOARD" });
        if (winners[winners.length - 1] === yourSide) setYourTurn(true);
        setPhase(Phase.Setup);
    };

    const onWithdraw = (_e: MouseEvent) => {
        forceWithdraw();
    };

    const onStart = () => {
        playPlanning();
        setPhase(Phase.Setup);
    };

    const onToggleMute = () => {
        setMute(!mute);
    };

    const onNewCount = () => {
        setSecond(10);
        timerRef.current && clearInterval(timerRef.current);
        timerRef.current = setInterval(() => {
            setSecond((p) => p - 1);
        }, 1000);
    };

    useOnStart((r) => {
        stopPlanning();
        setTurn(1);
        setAllyHit(0);
        setEnemyHit(0);
        onNewCount();
        setRound((prev) => prev + 1);
        r.firstPlayer === yourSide && setYourTurn(true);
    });

    useOnEnd(
        ({ responseStatus, previousRoundWinner, hostScore, guestScore }) => {
            stopPlaying();
            switch (responseStatus) {
                case "Reset by Admin":
                    dispatch({ type: "RESET_BOARD" });
                    setPhase(Phase.Welcome);
                    setAllyScore(0);
                    setEnemyScore(0);
                    setWinners([]);
                    setRound(0);
                    return setStatistic([]);
                case "Closed by Admin":
                    return setPhase(Phase.Finish);
                case "Withdrew":
                case "Abandoned":
                case "Destroyed":
                default:
                    setEndReason(responseStatus);
                    if (phase === Phase.Finish)
                        return (statsLock.current = true);
                    previousRoundWinner === yourSide && playVictory();
                    previousRoundWinner !== yourSide && playDefeat();
                    setPhase(Phase.Finish);
                    setAllyScore(isHost ? hostScore : guestScore);
                    setEnemyScore(isHost ? guestScore : hostScore);
                    return setWinners((prev) => [
                        ...prev,
                        previousRoundWinner as any,
                    ]);
            }
        }
    );

    useOnAdminSpectate(({ responseStatus, room }) => {
        if (responseStatus === "Connection Not Verified") {
            return history.push("/");
        }
    });

    useOnAvatar(({ hostAvatar, guestAvatar, hostUsername, guestUsername }) => {
        setEnemyAvatarSeed(isHost ? guestAvatar : hostAvatar);
        setEnemyUsername(isHost ? guestUsername : hostUsername);
    });

    useOnChat((msg) => {
        playChat();
        enemyChatQueue.addMessage(msg);
    });

    useOnShoot((r) => {
        playShootFire();
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

        onNewCount();
        dispatch({
            type: "MARK_SQUARE",
            payload: {
                side,
                position,
                status,
            },
        });

        setTurn((p) => p + 1);
        if (status === BoardSquareStatus.Hit) {
            side === Side.Enemy && setEnemyHit((prev) => prev + 1);
            side === Side.Ally && setAllyHit((prev) => prev + 1);
        }
    });

    useOnShipDestroyed(({ side, ship }) => {
        setTimeout(() => {
            playShootHit();
        }, 1000);

        if (ship.length <= 0) return;

        // waiting for backend ghostship fix
        dispatch({
            type: "SUNK_SHIP",
            payload: {
                battleship: deserializeBattleship(ship),
                side: side === yourSide ? Side.Ally : Side.Enemy,
            },
        });
    });

    useOnStatistics((r) => {
        if (statsLock.current) return;
        setStatistic((prev) => [...prev, r]);
    });

    useLayoutEffect(() => {
        if (!roomId) {
            history.push("/");
            return;
        }

        if (!isHost) {
            socket.joinRoom(username, roomId);
            socket.setAvatar(userAvatarSeed);
        }
    }, [history, isHost, roomId, username, userAvatarSeed]);

    useLayoutEffect(() => {
        phase === Phase.Welcome && playMatchmake();
    }, [phase, playMatchmake]);

    useEffect(() => {
        if (!enemyUsername || !enemyAvatarSeed)
            socket.setAvatar(userAvatarSeed);
    }, [userAvatarSeed, enemyUsername, enemyAvatarSeed]);

    useEffect(() => {
        if (mute) {
            stopPlanning();
            stopPlaying();
            stopVictory();
            stopDefeat();
        } else {
            if (phase === Phase.Setup) playPlanning();
            if (phase === Phase.Playing) playPlaying();
        }
    }, [
        mute,
        phase,
        playPlaying,
        playPlanning,
        stopPlaying,
        stopPlanning,
        stopDefeat,
        stopVictory,
    ]);

    if (phase === Phase.Welcome && !spectatorMode)
        return (
            <>
                <HostWelcome
                    onHostStartCallback={onStart}
                    avatarVersusComponent={<AvatarVersus {...avatarProps} />}
                />
                <MuteButton onClick={onToggleMute}>
                    {mute ? (
                        <VolumeMute size="1.625rem" color="#b3a3ff" />
                    ) : (
                        <VolumeUp size="1.625rem" color="#b3a3ff" />
                    )}
                </MuteButton>
            </>
        );

    const borderRadius =
        phase === Phase.Finish ? "0.75rem 0.75rem 0 0" : "0.75rem";
    const avatar = <AvatarVersus style={{ borderRadius }} {...avatarProps} />;
    const result = <Result winners={winners} stats={statistic} />;
    const turnCount = <RoundCount>Turn {turn}</RoundCount>;

    const timer = <Timer yourTurn={yourTurn}>{second}s</Timer>;

    const chat = {
        chatSide: yourSide === "Host" ? AvatarSide.Left : AvatarSide.Right,
        left: isHost ? playerChatQueue : enemyChatQueue,
        right: isHost ? enemyChatQueue : playerChatQueue,
    };

    const board = isHost ? (
        <BoardContainer>
            <Board
                hitCount={allyHit}
                selectable={false}
                boardType={Side.Ally}
                shipYard={battleship.ally}
                style={{ opacity: yourTurn ? 0.6 : 1 }}
            />
            <Board
                hitCount={enemyHit}
                selectable={yourTurn}
                boardType={Side.Enemy}
                shipYard={battleship.enemy}
                onSquareClick={onShoot}
                style={{ opacity: yourTurn ? 1 : 0.6 }}
            />
        </BoardContainer>
    ) : (
        <BoardContainer>
            <Board
                hitCount={enemyHit}
                selectable={yourTurn}
                boardType={Side.Enemy}
                shipYard={battleship.enemy}
                onSquareClick={onShoot}
                style={{ opacity: yourTurn ? 1 : 0.6 }}
            />
            <Board
                hitCount={allyHit}
                selectable={false}
                boardType={Side.Ally}
                shipYard={battleship.ally}
                style={{ opacity: yourTurn ? 0.6 : 1 }}
            />
        </BoardContainer>
    );

    const footer = (
        <Footer>
            <Withdraw onClick={onWithdraw}>Withdraw</Withdraw>
            <OneMoreRound
                disabled={!canPlayAgain(endReason)}
                onClick={onOneMoreRound}
            >
                One More Round
            </OneMoreRound>
        </Footer>
    );

    const reason = (
        <ReasonWrapper>
            {formalizeReason(
                endReason,
                winners[winners.length - 1] === yourSide
            )}
        </ReasonWrapper>
    );

    return (
            <TutorialWrapper>
        <Wrapper>

            <MuteButton onClick={onToggleMute}>
                {mute ? (
                    <VolumeMute size={26} color="#b3a3ff" />
                    ) : (
                        <VolumeUp size={26} color="#b3a3ff" />
                        )}
            </MuteButton>
            <ChatContext.Provider value={chat}>
                <GameStateContext.Provider value={{ state, dispatch }}>
                    {phase === Phase.Playing && timer}
                    {phase === Phase.Playing && turnCount}
                    {phase === Phase.Finish && reason}
                    {avatar}
                    {phase !== Phase.Finish && board}
                    {phase === Phase.Finish && result}
                    {!spectatorMode && <Chatbox />}
                    {phase === Phase.Finish && footer}
                    {phase === Phase.Setup && <Backdrop />}
                    {phase === Phase.Setup && (
                        <SetupModal onSubmit={onSubmit} />
                    )}
                </GameStateContext.Provider>
            </ChatContext.Provider>
        </Wrapper>
        </TutorialWrapper>
    );
};

export default GamePage;

function formalizeReason(reason: string | undefined, youWon: boolean): string {
    switch (reason) {
        case "Closed by Admin":
            return "Room Closed by Admin";
        case "Withdrew":
            return "Enemy Withdrew";
        case "Abandoned":
            return "Enemy Abandoned";
        case "Destroyed":
        default:
            if (youWon) return "You Won!";
            return "You Lose!";
    }
}

function canPlayAgain(reason: string | undefined): boolean {
    return reason === undefined || reason === "Destroyed";
}

const Wrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: auto;
    flex-flow: column;
    position: relative;
    min-width: 38.9375rem;
`;

const BoardContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 6.9375rem;

    margin-top: 4.3125rem;
    margin-bottom: 3.25rem;
    position: relative;
`;

const Footer = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 1rem;
    width: 100%;
`;

const OneMoreRound = styled.button<{ disabled?: boolean }>`
    outline: none;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.375rem 0.5rem;
    background: #ffdbb4;
    color: #674def;
    text-transform: uppercase;
    border-radius: 0.5rem;
    font-weight: 600;
    cursor: pointer;
    transform: scale(1, 1);

    ${({ disabled }) => {
        if (!disabled)
            return css`
                &:hover {
                    transform: scale(1.03, 1.06);
                }

                &:active {
                    transform: scale(0.97, 0.94);
                }
            `;
        return css`
            opacity: 0.5;
            cursor: default;
        `;
    }}
`;

const Withdraw = styled(OneMoreRound)`
    background: #8972ff;
    color: white;
    font-weight: 500;
    letter-spacing: 0.5px;
`;

const ReasonWrapper = styled.div`
    background: #947eff;
    border-radius: 0.75rem;
    font-weight: 700;
    font-size: 2.25rem;
    padding: 1rem 2.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    margin-bottom: 1rem;
`;

const MuteButton = styled.button`
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.5rem;
    outline: none;
    opacity: 0.7;
    transition: all 120ms ease;
    position: fixed;
    left: 2rem;
    bottom: 2rem;
    cursor: pointer;
    z-index: 6;

    &:hover {
        opacity: 1;
    }

    &:active {
        opacity: 0.85;
    }
`;

const Timer = styled.span<{ yourTurn: boolean }>`
    color: #c2b6ff;
    font-size: 1.25rem;
    font-weight: 500;
    position: absolute;
    top: -3.25rem;

    & > svg {
        position: absolute;
        transition: all 200ms ease;
        transform: rotate(${({ yourTurn }) => (yourTurn ? 0 : 180)}deg);
    }
`;

const RoundCount = styled.div`
    display: flex;
    width: auto;
    height: auto;
    padding: 0.375rem 0.625rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    align-items: center;
    justify-content: center;
    color: #674def;
    font-weight: 600;
    background: white;
    border-radius: 6px;
    z-index: 4;
    position: absolute;
    top: -1.375rem;
`;
