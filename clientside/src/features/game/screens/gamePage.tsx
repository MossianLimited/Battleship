import { useReducer } from "react";
import styled from "styled-components";
import Board from "../../board";
import { Side } from "../../board/types/utility";
import { initialGameState } from "../constants/state";
import { GameStateContext } from "../contexts/gameStateContext";
import gameStateReducer from "../reducers/gameStateReducer";

const GamePage = () => {
    const [state, dispatch] = useReducer(gameStateReducer, initialGameState);
    return (
        <GameStateContext.Provider value={{ state, dispatch }}>
            <BoardContainer>
                <Board boardType={Side.Ally} shipYard={state.battleship.ally} />
                <Board
                    boardType={Side.Enemy}
                    shipYard={state.battleship.enemy}
                />
            </BoardContainer>
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

export default GamePage;
