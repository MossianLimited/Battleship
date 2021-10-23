import { BrowserRouter as Router, Switch } from "react-router-dom";
import GamePage from "../../game/screens/gamePage";
import WelcomePage from "../../lobby/screens/welcomePage";
import LobbyRoute from "./lobbyRoute";

const MainRouter = () => {
    return (
        <Router>
            <Switch>
                <LobbyRoute path="/test">
                    <GamePage />
                </LobbyRoute>
                <LobbyRoute path="/">
                    <WelcomePage />
                </LobbyRoute>
            </Switch>
        </Router>
    );
};

export default MainRouter;
