import React from "react";
import styled from "styled-components";

interface Props {
    seed?: string;
    isRounded?: boolean;
    isSelected?: boolean;
    isFlipped?: boolean;
    onClickHandler?: () => void;
}

const UserAvatar: React.FC<Props> = ({
    seed = "123",
    isRounded,
    isSelected,
    isFlipped,
    onClickHandler,
}) => {
    if (isSelected && !isRounded)
        throw new Error("isSelected is only valid for 30 avatars");

    return (
        <Container
            onClick={() => onClickHandler && onClickHandler()}
            isRounded={isRounded}
            isSelected={isSelected}
            isFlipped={isFlipped}
        >
            <svg>
                <image
                    xlinkHref={`https://avatars.dicebear.com/api/open-peeps/${seed}.svg`}
                />
            </svg>
        </Container>
    );
};

const Container = styled.div<{
    isRounded?: boolean;
    isSelected?: boolean;
    isFlipped?: boolean;
}>`
    width: 5rem;
    height: 5rem;

    overflow: hidden;

    border-radius: ${(props) => (props.isRounded ? "50%" : "0")};
    border: ${(props) =>
        props.isSelected
            ? `solid 0.25rem ${props.theme.colors.lobby.avatar.selected}`
            : "none"};
    background: ${(props) =>
        props.isRounded
            ? props.theme.colors.lobby.avatar.background.white
            : "none"};

    opacity: ${(props) => (props.isRounded && !props.isSelected ? 0.7 : 1)};

    transform: ${(props) => (props.isFlipped ? "scaleX(-1)" : "none")};

    & > *,
    & > * > * {
        width: inherit;
        height: inherit;

        transform: ${(props) =>
            props.isSelected
                ? "translateY(-0.12rem) translateX(-0.22rem)"
                : "translateX(-0.1rem)"};
    }
`;

export default UserAvatar;
