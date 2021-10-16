import styled, { ThemeProvider } from "styled-components";
import Board from "./features/board";
import { theme } from "./styles/theme";
import GlobalStyles from "./styles/globalStyles";

const App = () => {
    return (
        <ThemeProvider theme={theme}>
            <GlobalStyles theme={theme} />
            <BoardContainer>
                <Board boardType="player" />
                <Board boardType="enemy" />
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
