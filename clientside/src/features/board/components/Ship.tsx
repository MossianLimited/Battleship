import { FC } from "react";
import styled from "styled-components";
import {
    BattleshipDirection,
    BattleshipPartType,
    BattleshipType,
} from "../types/battleship";

export interface Props {
    size?: number;
    color?: string;
    part: BattleshipPartType;
    direction: BattleshipDirection;
    type?: BattleshipType;
}

const ShipPart: FC<Props> = ({
    part,
    direction,
    size = 32,
    color = "#a9d5fd",
    type = BattleshipType.Default,
}) => {
    let rotateDeg = 0;
    switch (direction) {
        case BattleshipDirection.Horizontal:
            rotateDeg = 270;
            break;
        case BattleshipDirection.VerticalRev:
            rotateDeg = 180;
            break;
        case BattleshipDirection.HorizontalRev:
            rotateDeg = 90;
            break;
    }

    switch (part) {
        case BattleshipPartType.Front:
            return (
                <Wrapper rotate={rotateDeg}>
                    <svg
                        width={size}
                        height={size}
                        viewBox="0 0 32 32"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M2 25.1175C2 15.6683 7.1135 6.95898 15.3649 2.35443V2.35443C15.7596 2.13413 16.2404 2.13413 16.6351 2.35443V2.35443C24.8865 6.95898 30 15.6683 30 25.1175V32H2V25.1175Z"
                            fill={color}
                        />
                    </svg>
                </Wrapper>
            );
        case BattleshipPartType.Middle:
            return (
                <Wrapper rotate={rotateDeg}>
                    <svg
                        width={size}
                        height={size}
                        viewBox="0 0 32 32"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path d="M2 0H30V32H2V0Z" fill={color} />
                    </svg>
                </Wrapper>
            );
        case BattleshipPartType.Back:
            return (
                <Wrapper rotate={rotateDeg}>
                    <svg
                        width={size}
                        height={size}
                        viewBox="0 0 32 32"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M2 0H30V17C30 24.732 23.732 31 16 31V31C8.26801 31 2 24.732 2 17V0Z"
                            fill={color}
                        />
                    </svg>
                </Wrapper>
            );
        case BattleshipPartType.Single:
            return (
                <Wrapper rotate={rotateDeg}>
                    <SingleShip style={{ backgroundColor: color }} />
                </Wrapper>
            );
    }
};

export default ShipPart;

interface WrapperProps {
    rotate: number;
}

const Wrapper = styled.div<WrapperProps>`
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    transform-origin: center center;
    opacity: 0.5;
    transform: translate(-2px, -2px) rotate(${({ rotate }) => `${rotate}`}deg);
    cursor: grab;
`;

const SingleShip = styled.div`
    width: 28px;
    height: 28px;
    border-radius: 10px;
`;
