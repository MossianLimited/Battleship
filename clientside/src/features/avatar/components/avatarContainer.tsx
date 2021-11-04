import { AnimatePresence } from "framer-motion";
import React from "react";
import styled from "styled-components";
import { AvatarProperties, AvatarSide } from "../types/avatar";
import ChatBubbleList from "./chatBubbleList";
import UserAvatar from "./userAvatar";

const AvatarContainer: React.FC<AvatarProperties & { side: AvatarSide }> = ({
    seed,
    username,
    side,
}) => {
    return (
        <Container>
            <AnimatePresence>
                {seed && (
                    <>
                        <ChatBubbleList side={side} />
                        <UserAvatar
                            isFlipped={side === AvatarSide.Right}
                            seed={seed}
                            username={username}
                        />
                    </>
                )}
            </AnimatePresence>
        </Container>
    );
};

const Container = styled.div`
    display: flex;
    flex-flow: column;
    align-items: center;

    width: 5rem;
`;

export default AvatarContainer;
