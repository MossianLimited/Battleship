import { useReducer } from "react";
import styled, { ThemeProvider } from "styled-components";
import GlobalStyles from "./styles/globalStyles";
import Board from "./features/board";
import { theme } from "./styles/theme";
import { Side } from "./features/board/types/utility";
import { BoardState } from "./features/board/types/board";
import { BattleshipState } from "./features/board/types/battleship";
import renderGridFromGridSize from "./features/board/functions/renderGridFromGridSize";
import renderBattleshipTemplate from "./features/board/functions/renderBattleshipTemplate";

interface GameState {
    board: BoardState;
    battleship: BattleshipState;
}

type GameAction = {};

const globalReducer = (prev: GameState, action: GameAction): GameState => {
    return prev;
};

const App = () => {
    const [state, dispatch] = useReducer(globalReducer, {
        battleship: renderBattleshipTemplate(),
        board: {
            ally: renderGridFromGridSize(10),
            enemy: renderGridFromGridSize(10),
        },
    });

    return (
        <ThemeProvider theme={theme}>
            <GlobalStyles theme={theme} />
            <BoardContainer>
                <Board
                    board={state.board.ally}
                    boardType={Side.Ally}
                    shipYard={state.battleship.ally}
                />
                <Board
                    board={state.board.enemy}
                    boardType={Side.Enemy}
                    shipYard={state.battleship.enemy}
                />
            </BoardContainer>
        </ThemeProvider>
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

export default App;
