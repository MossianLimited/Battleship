import React from "react";
import { Route, RouteProps } from "react-router";
import LobbyLayoutWrapper from "../../lobby/wrappers/lobbyLayoutWrapper";

const LobbyRoute: React.FC<RouteProps> = ({ children, ...delegated }) => {
    const renderedComponent = (
        <LobbyLayoutWrapper>{children}</LobbyLayoutWrapper>
    );
    return <Route {...delegated}>{renderedComponent}</Route>;
};

export default LobbyRoute;
