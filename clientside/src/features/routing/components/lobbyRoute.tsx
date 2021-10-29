import React from "react";
import { Route, RouteProps, Redirect } from "react-router";
import { useUserContext } from "../../lobby/contexts/userContext";
import LobbyLayoutWrapper from "../../lobby/wrappers/lobbyLayoutWrapper";

const LobbyRoute: React.FC<{ userRequired?: boolean } & RouteProps> = ({
    userRequired,
    children,
    ...delegated
}) => {
    const renderedComponent = (
        <LobbyLayoutWrapper>{children}</LobbyLayoutWrapper>
    );
    const { username } = useUserContext();

    if (userRequired && !username) return <Redirect to="/" />;
    return <Route {...delegated}>{renderedComponent}</Route>;
};

export default LobbyRoute;
