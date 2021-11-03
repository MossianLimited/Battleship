import React from "react";
import styled from "styled-components";
import { AvatarProperties, AvatarSide } from "../types/avatar";
import ChatBubbleList from "./chatBubbleList";
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
                        <ChatBubbleList
                            chatFeed={chatFeed}
                            isFlipped={side === AvatarSide.Right}
                        />
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

export default AvatarContainer;
