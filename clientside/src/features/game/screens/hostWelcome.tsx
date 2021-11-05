import styled from "../../../styles/theme";

interface Props {
    avatarVersusComponent: JSX.Element;
    onHostStartCallback: () => void;
}

const HostWelcome: React.FC<Props> = ({
    avatarVersusComponent,
    onHostStartCallback,
}) => {
    return (
        <Container>
            <Welcome>Welcome!</Welcome>
            {avatarVersusComponent}
            <StartGameContainer onClick={onHostStartCallback}>
                Start Game
            </StartGameContainer>
        </Container>
    );
};

const Welcome = styled.span`
    font-weight: 600; 
    font-size: 1rem; 
    color: white; 
    height: min-content; 
    width: 100%; 
    display: flex; 
    align-items: center; 
    justify-content: center;
    padding: 0.5rem 0.75rem; 
    width: min-content; 
    border-radius: 8px; 
    background: #947EFF; 
`;

const Container = styled.div`
    display: flex;
    flex-flow: column;
    align-items: center;
    gap: 1.4375rem;

    & > *:nth-child(2) {
        width: 28.6875rem;
        height: 8.125rem;
    }
`;

const StartGameContainer = styled.div`
    display: grid;
    place-items: center;

    width: 8.6875rem;
    height: 2.3125rem;

    background: ${(props) =>
        props.theme.colors.lobby.button.background.startGame};
    border-radius: 0.5rem;

    font-weight: 700;
    font-size: 1rem;
    line-height: 1.3125rem;
    letter-spacing: 0.05em;
    text-transform: uppercase;

    cursor: pointer;

    color: ${(props) => props.theme.colors.lobby.button.text.startGame};

    transition: scale 100ms ease-in-out;
    &:hover {
        transition: scale 100ms ease-in-out;
        scale: 1.025;
    }
`;

export default HostWelcome;
