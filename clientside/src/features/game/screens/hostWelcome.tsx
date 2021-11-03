import styled from "styled-components";
import AvatarVersus from "../../avatar/components/avatarVersus";

interface Props {
    hostUsername?: string;
    hostAvatarSeed?: string;
    guestUsername?: string;
    guestAvatarSeed?: string;
    onHostStartCallback: () => void;
}

const HostWelcome: React.FC<Props> = ({
    hostUsername,
    hostAvatarSeed,
    guestUsername,
    guestAvatarSeed,
    onHostStartCallback,
}) => {
    return (
        <Container>
            <AvatarVersus
                leftAvatarSeed={hostAvatarSeed}
                leftAvatarUsername={hostUsername}
                rightAvatarSeed={guestAvatarSeed}
                rightAvatarUsername={guestUsername}
                leftScore={5}
                rightScore={5}
                leftChatFeed="Yo mama"
                rightChatFeed="Fuckkk"
            />
            <StartGameContainer onClick={onHostStartCallback}>
                Start Game
            </StartGameContainer>
        </Container>
    );
};

const Container = styled.div`
    display: flex;
    flex-flow: column;
    align-items: center;
    gap: 1.4375rem;

    & > *:first-child {
        width: 28.6875rem;
        height: 8.125rem;
    }
`;

const StartGameContainer = styled.div`
    display: grid;
    place-items: center;

    width: 8.6875rem;
    height: 2.3125rem;

    background: #ffffff;
    border-radius: 0.5rem;

    font-weight: 700;
    font-size: 1rem;
    line-height: 1.3125rem;
    letter-spacing: 0.05em;
    text-transform: uppercase;

    cursor: pointer;

    color: #674def;
`;

export default HostWelcome;
