import { useLayoutEffect, useReducer, useState } from "react";
import styled from "styled-components";
import { useHistory } from "react-router";
import socketClient from "../../../api/socketClient";
import Board from "../../board";
import { Side } from "../../board/types/utility";
import useQuery from "../../routing/hooks/useQuery";
import { initialGameState } from "../constants/state";
import { GameStateContext } from "../contexts/gameStateContext";
import gameStateReducer from "../reducers/gameStateReducer";
import { useUserContext } from "../../lobby/contexts/userContext";
import SetupModal from "../../setup";
import { MetaPhase } from "../types/state";
import useAutoWithdraw from "../functions/useAutoWithdraw";
import HostWelcome from "./hostWelcome";
import AvatarVersus from "../../avatar/components/avatarVersus";

const GamePage = () => {
    const [state, dispatch] = useReducer(gameStateReducer, initialGameState);

    const [guarded, forceWithdraw] = useAutoWithdraw();

    const query = useQuery();
    const history = useHistory();

    const roomId = query.get("roomId");
    const isHost = query.get("isHost") === "true";

    const [userStarted, setUserStarted] = useState<boolean>(false);
    const [enemyAvatarSeed, setEnemyAvatarSeed] = useState<string>("");
    const [enemyUsername, setEnemyUsername] = useState<string>("");

    const { username, userAvatarSeed } = useUserContext();

    useLayoutEffect(() => {
        if (!roomId) {
            guarded() || history.push("/welcome");
            return;
        }

        if (!isHost) {
            socketClient.joinRoom(username, roomId);
            socketClient.setAvatar(userAvatarSeed);
        }
        socketClient.subscribeToAvatar(
            ({ hostAvatar, guestAvatar, hostUsername, guestUsername }) => {
                setEnemyAvatarSeed(isHost ? guestAvatar : hostAvatar);
                setEnemyUsername(isHost ? guestUsername : hostUsername);
            }
        );
        socketClient.subscribeToEndResponse(forceWithdraw);
    }, [
        history,
        isHost,
        roomId,
        username,
        guarded,
        forceWithdraw,
        userAvatarSeed,
    ]);

    if (!userStarted)
        return (
            <HostWelcome
                guestUsername={isHost ? enemyUsername : username}
                hostUsername={isHost ? username : enemyUsername}
                guestAvatarSeed={isHost ? enemyAvatarSeed : userAvatarSeed}
                hostAvatarSeed={isHost ? userAvatarSeed : enemyAvatarSeed}
                onHostStartCallback={() => setUserStarted(true)}
            />
        );

    return (
        <GameStateContext.Provider value={{ state, dispatch }}>
            <AvatarVersus
                leftAvatarSeed={"test"}
                leftAvatarUsername={"test"}
                rightAvatarSeed={"test"}
                rightAvatarUsername={"test"}
                leftScore={5}
                rightScore={5}
            />
            <BoardContainer>
                <Board boardType={Side.Ally} shipYard={state.battleship.ally} />
                <Board
                    boardType={Side.Enemy}
                    shipYard={state.battleship.enemy}
                />
            </BoardContainer>
            {state.meta.phase === MetaPhase.Setup && <Backdrop />}
            {state.meta.phase === MetaPhase.Setup && <SetupModal />}
        </GameStateContext.Provider>
    );
};

const BoardContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 5.25rem;

    height: 100vh;
    width: 100vw;
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
