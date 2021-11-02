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
    background: ${(props) => props.theme.colors.lobby.backdrop.dark};

    position: relative;

    width: 100%;
    height: 100vh;
    overflow: hidden;

    display: flex;
    flex-flow: column;
    align-items: center;
    justify-content: center;
`;

export default LobbyLayoutWrapper;
