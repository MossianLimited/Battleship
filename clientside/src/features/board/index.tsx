import { useMemo } from "react";
import styled from "styled-components";
import Square from "./components/Square";
import { Position, Side } from "./types/utility";
import { UniBoardState } from "./types/board";
import {
    BattleshipAllyYard,
    BattleshipDirection,
    BattleshipPartRdState,
    BattleshipPartType,
    BattleshipStatus,
    BattleshipYard,
} from "./types/battleship";

/**
 * Overall Game State
 * =====
 * 0. MetaState:        Whose turn is it? How many turn have passed?
 * 1. BoardState:       Which cells already get hit or missed?
 * 2. BattleshipState:  Contain all battleships state, but enemy battleship
 *                      are added here only when it's completely sunken
 *                      meaning that its ready to be rendered. For example, at
 *                      the begeinning of the game the enemy ships state is empty.
 *                      Beginning state should also be randomized accordingly
 *                      to the specified rules.
 **/

type Props = AllyProps | EnemyProps;

interface AllyProps {
    board: UniBoardState;
    boardType: Side.Ally;
    shipYard: BattleshipAllyYard;
}

interface EnemyProps {
    board: UniBoardState;
    boardType: Side.Enemy;
    shipYard: BattleshipYard;
}

const Board: React.FC<Props> = ({ board, boardType, shipYard }) => {
    const mappedBattleshipPart = useMemo(() => {
        const map: Map<string, BattleshipPartRdState | undefined> = new Map();

        const filteredShipYard =
            boardType === Side.Ally
                ? shipYard
                : shipYard.filter(
                      ({ status }) => status !== BattleshipStatus.Hidden
                  );

        (filteredShipYard as BattleshipAllyYard)?.forEach((battleship) => {
            const { length, direction } = battleship;
            const position = { ...battleship.position };

            for (let i = 0; i < length; i++) {
                if (map.has(posToString(position)))
                    throw Error("The ally grid has overlapped battleships.");

                for (let j = 0; j < 9; j++) {
                    const rowOffset = Math.floor(j / 3) - 1;
                    const colOffset = (j % 3) - 1;

                    if (rowOffset === 0 && colOffset === 0) continue;

                    const targetPosition = {
                        col: position.col + colOffset,
                        row: position.row + rowOffset,
                    };

                    const potentialAdjacent = map.get(
                        posToString(targetPosition)
                    );
                    if (
                        potentialAdjacent &&
                        potentialAdjacent.battleship !== battleship
                    )
                        throw Error("Two ships are too close to each other.");
                }

                let partType: BattleshipPartType;

                if (i === 0) partType = BattleshipPartType.Front;
                else if (i === length - 1) partType = BattleshipPartType.Back;
                else partType = BattleshipPartType.Middle;

                if (length === 1) partType = BattleshipPartType.Single;

                map.set(posToString(position), {
                    battleship,
                    partType,
                });

                switch (direction) {
                    case BattleshipDirection.Vertical:
                        position.row++;
                        break;
                    case BattleshipDirection.Horizontal:
                        position.col++;
                        break;
                    case BattleshipDirection.VerticalRev:
                        position.row--;
                        break;
                    case BattleshipDirection.HorizontalRev:
                        position.col--;
                        break;
                }
            }
        });

        return map;
    }, [shipYard, boardType]);

    const renderedSquares = board.map(({ position }) => {
        const key = posToString(position);
        return (
            <Square
                key={key}
                squareType={boardType}
                position={position}
                part={mappedBattleshipPart.get(key) || undefined}
            />
        );
    });

    return (
        <Container size={Math.sqrt(board.length)}>{renderedSquares}</Container>
    );
};

function posToString({ row, col }: Position): string {
    return `${row},${col}`;
}

interface ContainerProps {
    size: number;
}

const Container = styled.div<ContainerProps>`
    z-index: 0;
    display: grid;
    grid-template-columns: repeat(${({ size }) => `${size}`}, min-content);
    grid-template-rows: repeat(${({ size }) => `${size}`}, min-content);
`;

export default Board;
