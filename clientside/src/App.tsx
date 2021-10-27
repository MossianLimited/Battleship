import { ThemeProvider } from "styled-components";
import MainRouter from "./features/routing/components/mainRouter";
import GlobalStyles from "./styles/globalStyles";
import { theme } from "./styles/theme";

const App = () => {
    return (
        <ThemeProvider theme={theme}>
            <GlobalStyles theme={theme} />
            <MainRouter />
        </ThemeProvider>
    );
};

export default App;
