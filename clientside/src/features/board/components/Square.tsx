import styled from "../../../styles/theme";
import ShipPart from "./Ship";
import { BattleshipPartRdState, BattleshipStatus } from "../types/battleship";
import { BoardSquareStatus } from "../types/board";
import { Position, Side } from "../types/utility";
import { useGameStateContext } from "../../game/contexts/gameStateContext";
import posToString from "../functions/posToString";
import { MouseEventHandler, useCallback } from "react";

interface Props {
    squareType?: Side;
    position?: Position;
    part?: BattleshipPartRdState;
    selectable?: boolean;
    onClick?: MouseEventHandler;
    onHoverStart?: MouseEventHandler;
    onHoverEnd?: MouseEventHandler;
}

const Square: React.FC<Props> = ({
    squareType = Side.Ally,
    position,
    part,
    onClick,
    onHoverStart,
    onHoverEnd,
    selectable = true,
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
            squareType={squareType}
            onMouseEnter={onHoverStart}
            onMouseLeave={onHoverEnd}
            onClick={onClick || handleSelectClick}
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
                    color={isSunken ? "#ff3d3dc7" : undefined}
                ></ShipPart>
            )}
            {status === BoardSquareStatus.Missed && (
                <Circle squareType={squareType} />
            )}
            {isSunken && <Circle squareType={squareType} hit={true} />}
        </Container>
    );
};

const Container = styled.div<{ squareType: Side }>`
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
`;

const ColumnAlphabet = styled.div`
    position: absolute;
    top: -2rem;
`;

const RowNumber = styled.div`
    position: absolute;
    left: -2rem;
`;

const Circle = styled.div<{ squareType: Side; hit?: boolean }>`
    width: 0.875rem;
    height: 0.875rem;
    position: absolute;
    z-index: 2;
    border-radius: 50%;

    background: ${(props) => {
        if (props.hit) return props.theme.colors.danger.main;
        return (props.theme.colors.square as any)[props.squareType].circle;
    }};
`;

export default Square;
