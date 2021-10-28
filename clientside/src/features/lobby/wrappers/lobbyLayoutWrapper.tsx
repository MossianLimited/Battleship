import styled from "../../../styles/theme";
import CreditsBox from "../components/creditsBox";

const LobbyLayoutWrapper: React.FC = ({ children }) => {
    return (
        <Container>
            <CreditsBox />
            {children}
        </Container>
    );
};

const Container = styled.div`
    background: ${(props) => props.theme.colors.lobby.backdrop.medium};

    height: 100vh;

    display: flex;
    flex-flow: column;
    align-items: center;
    justify-content: center;
`;

export default LobbyLayoutWrapper;
