import { ThemeProvider } from "styled-components";
import Board from "./features/board";
import { theme } from "./styles/theme";
import GlobalStyles from "./styles/globalStyles";

const App = () => {
    return (
        <ThemeProvider theme={theme}>
            <GlobalStyles theme={theme} />
            <Board />
        </ThemeProvider>
    );
};

export default App;
