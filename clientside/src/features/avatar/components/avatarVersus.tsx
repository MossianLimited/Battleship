import styled from "styled-components";
import UserAvatar from "./userAvatar";

interface Props {
    leftAvatarUsername?: string;
    leftAvatarSeed?: string;
    rightAvatarUsername?: string;
    rightAvatarSeed?: string;
}

const AvatarVersus: React.FC<Props> = ({
    leftAvatarUsername,
    leftAvatarSeed,
    rightAvatarUsername,
    rightAvatarSeed,
}) => {
    return (
        <Container>
            <AvatarContainer>
                {leftAvatarSeed && (
                    <>
                        <span>{leftAvatarUsername}</span>
                        <UserAvatar seed={leftAvatarSeed} />
                    </>
                )}
            </AvatarContainer>
            {leftAvatarSeed && rightAvatarSeed && <VS>vs</VS>}
            <AvatarContainer>
                {rightAvatarSeed && (
                    <>
                        <span>{rightAvatarUsername}</span>
                        <UserAvatar isFlipped seed={rightAvatarSeed} />
                    </>
                )}
            </AvatarContainer>
        </Container>
    );
};

const Container = styled.div`
    padding: 0 2.5625rem;

    border-radius: 0.75rem;

    height: 8.125rem;
    width: 100%;
    background: ${(props) => props.theme.colors.lobby.avatar.background.light};

    display: flex;
    align-items: flex-end;
    justify-content: space-between;
`;

const AvatarContainer = styled.div`
    display: flex;
    flex-flow: column;
    align-items: center;

    width: 5rem;

    & > span {
        user-select: none;

        font-weight: 500;
        font-size: 1rem;
        line-height: 1.3125rem;

        color: ${(props) => props.theme.colors.lobby.avatar.text.name};
    }
`;

const VS = styled.div`
    align-self: center;

    font-weight: 500;
    font-size: 3rem;
    line-height: 3.875rem;

    color: ${(props) => props.theme.colors.lobby.avatar.text.versus};
`;

export default AvatarVersus;
