import styled from "../../../styles/theme";

const LobbyLayoutWrapper: React.FC = ({ children }) => {
    return <Container>{children}</Container>;
};

const Container = styled.div`
    background: ${(props) => props.theme.colors.lobby.backdrop.medium};

    height: 100vh;

    display: flex;
    flex-flow: column;
    align-items: center;
`;

export default LobbyLayoutWrapper;
