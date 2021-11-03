import styled from "styled-components";
import UserAvatar from "./userAvatar";

interface Props {
    leftAvatarUsername?: string;
    leftAvatarSeed?: string;
    leftChatFeed?: string;
    leftScore?: number;
    rightAvatarUsername?: string;
    rightAvatarSeed?: string;
    rightChatFeed?: string;
    rightScore?: number;
}

const AvatarVersus: React.FC<Props> = ({
    leftAvatarUsername,
    leftAvatarSeed,
    leftChatFeed,
    leftScore,
    rightAvatarUsername,
    rightAvatarSeed,
    rightChatFeed,
    rightScore,
}) => {
    if ((leftScore && !rightScore) || (rightScore && !leftScore))
        throw new Error("Both players need scores");

    return (
        <Container
            isExpanded={leftScore !== undefined && rightScore !== undefined}
        >
            <AvatarContainer>
                {leftAvatarSeed && (
                    <>
                        {leftChatFeed && (
                            <ChatBubble>
                                <div>{leftChatFeed}</div>
                            </ChatBubble>
                        )}
                        <span>{leftAvatarUsername}</span>
                        <UserAvatar seed={leftAvatarSeed} />
                    </>
                )}
            </AvatarContainer>
            {leftAvatarSeed && rightAvatarSeed && (
                <VS>
                    {leftScore && <span className="score">{leftScore}</span>}
                    <span className="vs-text">vs</span>
                    {rightScore && <span className="score">{rightScore}</span>}
                </VS>
            )}
            <AvatarContainer>
                {rightAvatarSeed && (
                    <>
                        {rightChatFeed && (
                            <ChatBubble isFlipped>
                                <div>{rightChatFeed}</div>
                            </ChatBubble>
                        )}
                        <span>{rightAvatarUsername}</span>
                        <UserAvatar isFlipped seed={rightAvatarSeed} />
                    </>
                )}
            </AvatarContainer>
        </Container>
    );
};

const Container = styled.div<{ isExpanded?: boolean }>`
    padding: 0 2.5625rem;

    border-radius: 0.75rem;

    height: 8.125rem;
    min-width: ${(props) => (props.isExpanded ? "38.9375rem" : "100%")};
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
    display: flex;
    align-items: center;
    align-self: center;
    gap: 4.375rem;

    & > .vs-text {
        font-weight: 500;
        font-size: 3rem;
        line-height: 3.875rem;

        color: ${(props) => props.theme.colors.lobby.avatar.text.versus};
    }

    & > .score {
        font-weight: 500;
        font-size: 4.5rem;
        line-height: 5.875rem;

        color: ${(props) => props.theme.colors.lobby.avatar.text.score};
    }
`;

const ChatBubble = styled.div<{ isFlipped?: boolean }>`
    position: relative;
    top: -0.75rem;

    width: 12rem;

    font-weight: 500;

    font-size: 1rem;
    line-height: 1.3125rem;

    color: ${(props) => props.theme.colors.lobby.avatar.text.chat};

    display: flex;

    & > div {
        position: relative;
        top: 0rem;

        max-width: 12rem;
        width: max-content;
        background: ${(props) =>
            props.theme.colors.lobby.avatar.background.white};
        padding: 0.625rem 0.875rem;
        border-radius: 0.375rem;

        overflow-wrap: break-word;
        word-wrap: break-word;
        -webkit-hyphens: auto;
        -ms-hyphens: auto;
        -moz-hyphens: auto;
        hyphens: auto;

        &::before {
            content: "";
            position: absolute;
            width: 0.875rem;
            height: 0.875rem;
            bottom: -0.4375rem;

            background: ${(props) =>
                props.theme.colors.lobby.avatar.background.white};

            transform: rotate(-45deg);

            ${(props) => `${props.isFlipped ? "right" : "left"}: 1.5em`};
        }

        ${(props) =>
            `transform: translateX(${props.isFlipped ? "-4em" : "4em"})`}
    }

    ${(props) =>
        `justify-content: ${props.isFlipped ? "flex-end" : "flex-start"}`}
`;

export default AvatarVersus;
