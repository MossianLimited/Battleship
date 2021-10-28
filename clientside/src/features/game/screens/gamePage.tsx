import { useEffect, useLayoutEffect, useReducer } from "react";
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

const GamePage = () => {
    const [state, dispatch] = useReducer(gameStateReducer, initialGameState);

    const query = useQuery();
    const history = useHistory();

    const { username } = useUserContext();

    const roomId = query.get("roomId");
    const isHost = query.get("isHost") === "true";

    useLayoutEffect(() => {
        if (!roomId) {
            history.push("/welcome");
            return;
        }

        if (!isHost) socketClient.joinRoom(username, roomId);

        socketClient.subscribeToEndResponse(({ responseStatus }) => {
            alert(responseStatus);
            history.push("/welcome");
        });

        return () => {
            socketClient.withdraw();
        };
    }, [history, isHost, roomId, username]);

    return (
        <GameStateContext.Provider value={{ state, dispatch }}>
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
