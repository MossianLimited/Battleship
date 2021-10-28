import { BrowserRouter as Router, Switch } from "react-router-dom";
import GamePage from "../../game/screens/gamePage";
import CreateRoomPage from "../../lobby/screens/createRoomPage";
import JoinRoomPage from "../../lobby/screens/joinRoomPage";
import WelcomePage from "../../lobby/screens/welcomePage";
import LobbyRoute from "./lobbyRoute";

const MainRouter = () => {
    return (
        <Router>
            <Switch>
                <LobbyRoute path="/room">
                    <GamePage />
                </LobbyRoute>
                <LobbyRoute path="/new" userRequired>
                    <CreateRoomPage />
                </LobbyRoute>
                <LobbyRoute path="/rooms" userRequired>
                    <JoinRoomPage />
                </LobbyRoute>
                <LobbyRoute path="/">
                    <WelcomePage />
                </LobbyRoute>
            </Switch>
        </Router>
    );
};

export default MainRouter;
