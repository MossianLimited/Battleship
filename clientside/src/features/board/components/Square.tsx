import styled from "../../../styles/theme";
import ShipPart from "./Ship";
import { BattleshipPartRdState, BattleshipStatus } from "../types/battleship";
import { BoardSquareStatus } from "../types/board";
import { Position, Side } from "../types/utility";
import { useGameStateContext } from "../../game/contexts/gameStateContext";
import posToString from "../functions/posToString";
import { MouseEventHandler, useCallback } from "react";
import { css } from "styled-components";

interface Props {
    squareType?: Side;
    position?: Position;
    part?: BattleshipPartRdState;
    selectable?: boolean;
    onClick?: MouseEventHandler;
    onHoverStart?: MouseEventHandler;
    onHoverEnd?: MouseEventHandler;
    [key: string]: any; 
}

const Square: React.FC<Props> = ({
    squareType = Side.Ally,
    position,
    part,
    onClick,
    onHoverStart,
    onHoverEnd,
    selectable = true,
    ...delegated
}) => {
    const { state, dispatch } = useGameStateContext();

    const status =
        position && state.board[squareType][posToString(position)]?.status;
    const isSunken = part && part.battleship.status === BattleshipStatus.Sunken;

    const handleSelectClick = useCallback(() => {
        if (position && selectable) {
            dispatch({
                type: "MARK_SQUARE",
                payload: {
                    side: squareType,
                    position,
                    status: BoardSquareStatus.Missed,
                },
            });
        }
    }, [dispatch, position, selectable, squareType]);

    return (
        <Container
            selectable={selectable}
            squareType={squareType}
            onMouseEnter={onHoverStart}
            onMouseLeave={onHoverEnd}
            onClick={onClick || handleSelectClick}
            {...delegated}
        >
            {position?.row === 1 && (
                <ColumnAlphabet className="positional">
                    {String.fromCharCode(65 + position?.col - 1)}
                </ColumnAlphabet>
            )}
            {position?.col === 1 && (
                <RowNumber className="positional">{position.row}</RowNumber>
            )}
            {part && (
                <ShipPart
                    part={part.partType}
                    direction={part.battleship.direction}
                    color={isSunken ? "#FFBCB2" : undefined}
                ></ShipPart>
            )}
            <Circle squareType={squareType} status={status} />
        </Container>
    );
};

const Container = styled.div<{ squareType: Side, selectable: boolean }>`
    position: relative;

    background: ${(props) =>
        (props.theme.colors.square as any)[props.squareType].background.light};

    border: 0.125rem solid
        ${(props) => props.theme.colors.lobby.backdrop.medium};
    border-radius: 0.25rem;

    width: 2rem;
    height: 2rem;

    display: grid;
    place-items: center;

    cursor: pointer;

    & > .positional {
        font-weight: bold;

        height: 100%;
        width: 100%;

        display: grid;
        place-items: center;

        color: ${(props) => props.theme.colors.square.text.position};

        user-select: none;
    }

    ${({ selectable, theme }) => selectable && css`
        &::after {
            content: "";
            width: 0.875rem;
            height: 0.875rem;
            border-radius: 50%;
            position: absolute;
            background: ${theme.colors.square.ally.circle};
            z-index: 1;
            opacity: 0;
            transition: opacity 350ms ease;
        }

        &:hover::after {
            opacity: 0.75;
        }
    `}
`;

const ColumnAlphabet = styled.div`
    position: absolute;
    top: -2rem;
`;

const RowNumber = styled.div`
    position: absolute;
    left: -2rem;
`;

const Circle = styled.div<{ squareType: Side; status?: BoardSquareStatus }>`
    width: 0.875rem;
    height: 0.875rem;
    position: absolute;
    z-index: 2;
    border-radius: 50%;

    background: ${({ theme, status, squareType }) => {
        switch (status) {
            case BoardSquareStatus.Hit:
                return theme.colors.danger.main;
            case BoardSquareStatus.Missed:
                return (theme.colors.square as any)[squareType].circle;
        }
    }};
`;

export default Square;
