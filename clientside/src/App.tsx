import { useEffect, useState } from "react";
import { ThemeProvider } from "styled-components";
import socketClient from "./api/socketClient";
import { UserContext } from "./features/lobby/contexts/userContext";
import MainRouter from "./features/routing/components/mainRouter";
import GlobalStyles from "./styles/globalStyles";
import { theme } from "./styles/theme";

const App = () => {
    const [username, setUsername] = useState<string>(
        localStorage.getItem("username") || ""
    );
    const [userAvatarSeed, setUserAvatarSeed] = useState<string>(
        localStorage.getItem("userAvatarSeed") || "nnaries"
    );
    const [isAdmin, setIsAdmin] = useState<boolean>(false);

    useEffect(() => {
        localStorage.setItem("username", username);
    }, [username]);

    useEffect(() => {
        return () => {
            socketClient.disconnect();
        };
    }, []);

    return (
        <UserContext.Provider
            value={{
                username,
                userAvatarSeed,
                isAdmin,
                setUsername,
                setUserAvatarSeed,
                setIsAdmin,
            }}
        >
            <ThemeProvider theme={theme}>
                <GlobalStyles theme={theme} />
                <MainRouter />
            </ThemeProvider>
        </UserContext.Provider>
    );
};

export default App;
