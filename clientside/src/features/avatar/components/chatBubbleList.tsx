import React from "react";
import styled from "styled-components";
import { useChatContext } from "../../game/contexts/chatContext";
import { AvatarSide } from "../types/avatar";

const ChatBubbleList: React.FC<{ side: AvatarSide }> = ({ side }) => {
    const { queue } = useChatContext()[side];

    const displayedBubbles = queue
        .reverse()
        .slice(0, 2)
        .map((message, idx) => (
            <ChatBubble
                key={message.timestamp}
                isFlipped={side === AvatarSide.Right}
            >
                <div>{message.content}</div>
            </ChatBubble>
        ));

    if (!queue.length) return null;
    return <Container>{displayedBubbles}</Container>;
};

const Container = styled.div`
    position: relative;
    top: -0.75rem;

    display: flex;
    flex-flow: column-reverse;
    gap: 0.4375rem;
`;

const ChatBubble = styled.div<{
    isFlipped?: boolean;
    opacity?: number;
    hasTail?: boolean;
}>`
    width: 12rem;

    font-weight: 500;

    font-size: 1rem;
    line-height: 1.3125rem;

    color: ${(props) => props.theme.colors.lobby.avatar.text.chat};
    opacity: ${(props) => props.opacity || 1};

    display: flex;

    &:first-child > div::before {
        content: "";
        position: absolute;
        width: 0.875rem;
        height: 0.875rem;
        bottom: -0.4375rem;

        background: ${(props) =>
            props.theme.colors.lobby.avatar.background.white};

        transform: rotate(-45deg);

        ${(props) => (props.isFlipped ? "right" : "left")}: 1.5em;
    }

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

        ${(props) =>
            `transform: translateX(${props.isFlipped ? "-4em" : "4em"})`}
    }

    ${(props) =>
        `justify-content: ${props.isFlipped ? "flex-end" : "flex-start"}`}
`;

export default ChatBubbleList;
