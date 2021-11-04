import { AnimatePresence, motion } from "framer-motion";
import React from "react";
import styled from "styled-components";

const variants = {
    fadeIn: {
        initial: {
            opacity: 0,
        },
        animate: {
            opacity: 1,
        },
        transition: {
            delay: 0.35,
            duration: 0.2,
        },
    },
    moveInLeft: {
        initial: {
            x: -40,
            opacity: 0,
        },
        animate: {
            x: 0,
            opacity: 1,
        },
        exit: {
            x: -40,
            opacity: 0,
        },
        transition: {
            type: "spring",
        },
    },
    moveInRight: {
        initial: {
            x: 40,
            opacity: 0,
        },
        animate: {
            x: 0,
            opacity: 1,
        },
        exit: {
            x: 40,
            opacity: 0,
        },
        transition: {
            type: "spring",
        },
    },
    notSelected: {
        animate: { opacity: 0.7 },
        transition: {
            duration: 0.1,
        },
    },
    selected: {
        animate: {
            opacity: 1,
        },
        transition: {
            duration: 0.1,
        },
    },
    none: {},
};

interface Props {
    seed?: string;
    username?: string;
    isRounded?: boolean;
    isSelected?: boolean;
    isFlipped?: boolean;
    variant?: keyof typeof variants;
    onClickHandler?: () => void;
}

const UserAvatar: React.FC<Props> = ({
    seed = "123",
    username,
    isRounded,
    isSelected,
    isFlipped,
    variant,
    onClickHandler,
}) => {
    // errors for devs
    if (isSelected && !isRounded)
        throw new Error("isSelected is only valid for 30 avatars");
    if (isRounded && username)
        throw new Error("You can only have usernames for non-rounded avatars");

    return (
        <Container
            onClick={() => onClickHandler && onClickHandler()}
            isRounded={isRounded}
            isSelected={isSelected}
            isFlipped={isFlipped}
            {...variants[
                variant ??
                    (!isRounded
                        ? isFlipped
                            ? "moveInRight"
                            : "moveInLeft"
                        : isSelected
                        ? "selected"
                        : "notSelected")
            ]}
            whileHover={isRounded ? { scale: 1.05, opacity: 1 } : undefined}
        >
            <AnimatePresence>
                {username && <Username>{username}</Username>}
            </AnimatePresence>
            <motion.svg
                {...variants[variant ?? (isRounded ? "fadeIn" : "none")]}
                style={isFlipped ? { scaleX: -1 } : undefined}
            >
                <motion.image
                    xlinkHref={`https://avatars.dicebear.com/api/open-peeps/${seed}.svg?scale=85`}
                />
            </motion.svg>
        </Container>
    );
};

const Container = styled(motion.div)<{
    isRounded?: boolean;
    isSelected?: boolean;
    isFlipped?: boolean;
}>`
    width: 5rem;
    height: 5rem;

    position: relative;

    border-radius: ${(props) => (props.isRounded ? "50%" : "0")};
    border: ${(props) =>
        props.isSelected
            ? `solid 0.25rem ${props.theme.colors.lobby.avatar.selected}`
            : "none"};
    background: ${(props) =>
        props.isRounded
            ? props.theme.colors.lobby.avatar.background.white
            : "none"};

    display: flex;
    justify-content: center;

    & > svg,
    & > svg > image {
        width: inherit;
        height: inherit;

        transform: ${(props) =>
            props.isSelected
                ? "translateY(-0.125rem) translateX(-0.227rem)"
                : "translateX(-0.1rem)"};
    }

    ${(props) => props.isRounded && "overflow: hidden"};
`;

const Username = styled(motion.span)`
    position: absolute;
    top: -1rem;

    user-select: none;

    font-weight: 500;
    font-size: 1rem;
    line-height: 1.3125rem;

    color: ${(props) => props.theme.colors.lobby.avatar.text.name};
`;

export default UserAvatar;
