import { FC, MouseEvent } from "react";
import styled, { css } from "styled-components";
import ShipPart from "../../board/components/Ship";
import {
    BattleshipBase,
    BattleshipDirection,
    BattleshipPartType,
} from "../../board/types/battleship";
import { PlacementStatus } from "../types/placement";

interface ShipProps {
    battleship: BattleshipBase;
    status: PlacementStatus;
    selected: boolean; 
    onClick: (e: MouseEvent) => void;
}

const Ship: FC<ShipProps> = ({ battleship, status, selected, onClick }) => {
    const opacity = status === PlacementStatus.Placed ? 0.4 : 1.0;

    return (
        <ShipWrapper selected={selected} style={{ opacity }} onClick={onClick}>
            <ShipPart
                part={BattleshipPartType.Front}
                direction={BattleshipDirection.Vertical}
                translateFixed={false}
            ></ShipPart>
            <ShipPart
                part={BattleshipPartType.Middle}
                direction={BattleshipDirection.Vertical}
                translateFixed={false}
            ></ShipPart>
            <ShipPart
                part={BattleshipPartType.Middle}
                direction={BattleshipDirection.Vertical}
                translateFixed={false}
            ></ShipPart>
            <ShipPart
                part={BattleshipPartType.Back}
                direction={BattleshipDirection.Vertical}
                translateFixed={false}
            ></ShipPart>
            <ShipNumber>{battleship.name}</ShipNumber>
        </ShipWrapper>
    );
};

export default Ship;

interface ShipWrapperProps {
    selected: boolean;
}

const ShipWrapper = styled.div<ShipWrapperProps>`
    display: flex;
    flex-flow: column nowrap;
    align-items: center;
    justify-content: center;
    height: min-content;
    margin: 0.375rem 1px 0;
    position: relative; 

    ${({ selected }) => {
        if (selected) return css`
            &::before {
                content: "";
                border-radius: 8px;
                border: 4px solid #fff06b;
                position: absolute;
                width: calc(100% - 3px);
                height: calc(100% - 3px);
                box-shadow: inset 0 0 2px rgba(0, 0, 0, 0.15),
                    inset 0 0 8px rgba(0, 0, 0, 0.15);
            }
        `;
    }}
`;

const ShipNumber = styled.span`
    position: absolute;
    font-size: 1.75rem;
    color: #bbb1e9;
    font-weight: 700;
    z-index: 2;
`;
