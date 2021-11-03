import { FC } from "react";
import styled, { css } from "styled-components";
import {
    BattleshipDirection,
    BattleshipPartType,
    BattleshipType,
} from "../types/battleship";

const ROTATE_DEG_MAP = [0, 270, 180, 90];

export interface Props {
    size?: number;
    color?: string;
    zIndex?: number;
    translateFixed?: boolean;
    part: BattleshipPartType;
    direction: BattleshipDirection;
    type?: BattleshipType;
}

const ShipPart: FC<Props> = ({
    part,
    direction,
    size = 32,
    zIndex = 1,
    translateFixed = true,
    color = "rgba(100%, 100%, 100%)",
    type = BattleshipType.Default,
}) => {
    let rotateDeg = ROTATE_DEG_MAP[direction];
    let renderedShip = null;

    switch (part) {
        case BattleshipPartType.Front:
            renderedShip = (
                <svg
                    viewBox="0 0 32 32"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M2 25.1175C2 15.6683 7.1135 6.95898 15.3649 2.35443V2.35443C15.7596 2.13413 16.2404 2.13413 16.6351 2.35443V2.35443C24.8865 6.95898 30 15.6683 30 25.1175V32H2V25.1175Z"
                        fill={color}
                    />
                </svg>
            );
            break;
        case BattleshipPartType.Middle:
            renderedShip = (
                <svg
                    viewBox="0 0 32 32"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path d="M2 0H30V32H2V0Z" fill={color} />
                </svg>
            );
            break;
        case BattleshipPartType.Back:
            renderedShip = (
                <svg
                    viewBox="0 0 32 32"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M2 0H30V17C30 24.732 23.732 31 16 31V31C8.26801 31 2 24.732 2 17V0Z"
                        fill={color}
                    />
                </svg>
            );
            break;
        case BattleshipPartType.Single:
            renderedShip = <SingleShip style={{ backgroundColor: color }} />;
    }

    return (
        <Wrapper
            rotate={rotateDeg}
            size={size}
            style={{ zIndex }}
            fixed={translateFixed}
        >
            {renderedShip}
        </Wrapper>
    );
};

export default ShipPart;

interface WrapperProps {
    rotate: number;
    size: number;
    fixed: boolean;
}

const Wrapper = styled.div<WrapperProps>`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2rem;
    height: 2rem;
    opacity: 0.9;
    transform-origin: center center;

    ${({ fixed, rotate }) =>
        !fixed
            ? ""
            : css`
                  transform: translate(-0.125rem, -0.125rem)
                      rotate(${rotate}deg);
              `}

    & > svg {
        height: ${({ size }) => `${size / 16}rem`};
        width: ${({ size }) => `${size / 16}rem`};
    }
`;

const SingleShip = styled.div`
    width: 1.75rem;
    height: 1.75rem;
    border-radius: 0.625rem;
`;
