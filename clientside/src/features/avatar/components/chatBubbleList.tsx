import React from "react";
import styled from "styled-components";

const ChatBubbleList: React.FC<{ chatFeed: string[]; isFlipped?: boolean }> = ({
    chatFeed,
    isFlipped,
}) => {
    const displayedBubbles = chatFeed
        .reverse()
        .slice(0, 4)
        .map((message, idx) => (
            <ChatBubble
                isFlipped={isFlipped}
                opacity={(4 - idx) / 4}
                hasTail={idx === 0}
                key={message + idx.toString()}
            >
                <div>{message}</div>
            </ChatBubble>
        ));

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
            props.hasTail &&
            `&::before {
            content: "";
            position: absolute;
            width: 0.875rem;
            height: 0.875rem;
            bottom: -0.4375rem;

            background: ${props.theme.colors.lobby.avatar.background.white};

            transform: rotate(-45deg);

            ${props.isFlipped ? "right" : "left"}: 1.5em;
        }`}

        ${(props) =>
            `transform: translateX(${props.isFlipped ? "-4em" : "4em"})`}
    }

    ${(props) =>
        `justify-content: ${props.isFlipped ? "flex-end" : "flex-start"}`}
`;

export default ChatBubbleList;
