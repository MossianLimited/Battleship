import React from "react";
import styled from "styled-components";
import { AvatarProperties, AvatarSide } from "../types/avatar";
import UserAvatar from "./userAvatar";

const AvatarContainer: React.FC<AvatarProperties & { side: AvatarSide }> = ({
    seed,
    chatFeed,
    username,
    side,
}) => {
    return (
        <Container>
            {seed && (
                <>
                    {chatFeed && (
                        <ChatBubble isFlipped={side === AvatarSide.Right}>
                            <div>{chatFeed[0]}</div>
                        </ChatBubble>
                    )}
                    <span>{username}</span>
                    <UserAvatar
                        isFlipped={side === AvatarSide.Right}
                        seed={seed}
                    />
                </>
            )}
        </Container>
    );
};

const Container = styled.div`
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

export default AvatarContainer;
