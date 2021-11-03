import {
    useLayoutEffect,
    useReducer,
    useState,
    MouseEvent,
    useEffect,
} from "react";
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
import { useOnChat } from "../functions/useOnChat";
import useChatQueue from "../../avatar/hooks/useChatQueue";
import { AvatarProperties, AvatarSide } from "../../avatar/types/avatar";

const GamePage = () => {
    // eslint-disable-next-line
    const [_guarded, forceWithdraw] = useAutoWithdraw();
    const [yourTurn, setYourTurn] = useState(false);
    const [state, dispatch] = useReducer(gameStateReducer, initialGameState);

    const query = useQuery();
    const history = useHistory();

    const { meta, battleship } = state;
    const { username, userAvatarSeed } = useUserContext();

    const playerChatQueue = useChatQueue();
    const enemyChatQueue = useChatQueue();

    const roomId = query.get("roomId");
    const isHost = query.get("isHost") === "true";
    const yourSide = isHost ? "Host" : "Guest";

    const [userStarted, setUserStarted] = useState<boolean>(false);
    const [enemyAvatarSeed, setEnemyAvatarSeed] = useState<string>("");
    const [enemyUsername, setEnemyUsername] = useState<string>("");

    const combinedAvatarProps: Record<AvatarSide, AvatarProperties> = {
        left: {
            seed: isHost ? userAvatarSeed : enemyAvatarSeed,
            username: isHost ? username : enemyUsername,
            score: userStarted ? 5 : undefined,
            chatFeed: playerChatQueue.queue,
        },
        right: {
            seed: isHost ? enemyAvatarSeed : userAvatarSeed,
            username: isHost ? enemyUsername : username,
            score: userStarted ? 5 : undefined,
            chatFeed: enemyChatQueue.queue,
        },
    };

    useEffect(() => {
        const interval = setInterval(() => {
            enemyChatQueue.addMessage((Math.random() * 100).toString());
        }, 1000);
        return () => clearInterval(interval);
    }, [enemyChatQueue]);

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

    const avatarVersusComponent = <AvatarVersus {...combinedAvatarProps} />;

    useOnEndSingle(() => forceWithdraw());
    useOnStartSingle((r) => r.firstPlayer === yourSide && setYourTurn(true));

    useOnAvatar(({ hostAvatar, guestAvatar, hostUsername, guestUsername }) => {
        setEnemyAvatarSeed(isHost ? guestAvatar : hostAvatar);
        setEnemyUsername(isHost ? guestUsername : hostUsername);
    });

    // useOnChat((msg) => {
    //     // enemyChatQueue.addMessage(msg);
    // });

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

    const onShoot = async (pos: Position, _e: MouseEvent) => {
        if (!yourTurn) return;
        const serialized = serializePos(pos);
        await socket.shoot(serialized);
    };

    return userStarted ? (
        <GameStateContext.Provider value={{ state, dispatch }}>
            {avatarVersusComponent}
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
            {/* {meta.phase === MetaPhase.Setup && <Backdrop />} */}
            {/* {meta.phase === MetaPhase.Setup && <SetupModal />} */}
        </GameStateContext.Provider>
    ) : (
        <HostWelcome
            avatarVersusComponent={avatarVersusComponent}
            onHostStartCallback={() => setUserStarted(true)}
        />
    );
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
