import { useState } from "react";
import styled from "../../../styles/theme";
import ShipPart from "./Ship";
import { BattleshipPartRdState, BattleshipStatus } from "../types/battleship";
import { BoardSquare } from "../types/board";
import { Side } from "../types/utility";

interface Props {
    squareType?: Side;
    position?: BoardSquare["position"];
    part?: BattleshipPartRdState;
}

const Square: React.FC<Props> = ({
    squareType = Side.Ally,
    position,
    part,
}) => {
    const [selected, setSelected] = useState<boolean>(false); // temporary for mvp testing
    const isSunken = part && part.battleship.status === BattleshipStatus.Sunken;

    return (
        <Container
            squareType={squareType}
            onClick={() => setSelected(!selected)}
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
                    color={isSunken ? "#ff00556f" : undefined}
                ></ShipPart>
            )}
            {selected && <Circle squareType={squareType} />}
            {isSunken && <Circle squareType={squareType} hit={true} />}
        </Container>
    );
};

const Container = styled.div<{ squareType: Side }>`
    position: relative;

    background: ${(props) =>
        (props.theme.colors.square as any)[props.squareType].background.light};

    border: 0.125rem solid white;
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

        color: ${(props) => props.theme.colors.text.position};

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

const Circle = styled.div<{ squareType: Side, hit?: boolean }>`
    width: 0.875rem;
    height: 0.875rem;
    position: absolute;
    z-index: 2;
    border-radius: 50%;

    background: ${(props) => {
        if (props.hit) 
            return props.theme.colors.danger.main;
        return (props.theme.colors.square as any)[props.squareType].circle;
    }};
`;

export default Square;
