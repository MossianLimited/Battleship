import { MouseEvent, useMemo } from "react";
import styled from "styled-components";
import Square from "./components/Square";
import mapPosToBattleshipPart from "./functions/mapPosToBattleshipPart";
import posToString from "./functions/posToString";
import {
    BattleshipAllyYard,
    BattleshipPartType,
    BattleshipStatus,
    BattleshipYard,
} from "./types/battleship";
import { Position, Side } from "./types/utility";
import { useGameStateContext } from "../game/contexts/gameStateContext";
import generateArrayOfNumbers from "./functions/generateArrayOfNumbers";

type Props = InteractiveProps & (AllyProps | EnemyProps);

interface InteractiveProps {
    selectable?: boolean;
    validate?: boolean;
    availability?: boolean[][];
    onSquareHoverStart?: (p: Position, e: MouseEvent) => any;
    onSquareHoverEnd?: (p: Position, e: MouseEvent) => any;
    onSquareClick?: (p: Position, e: MouseEvent) => any;
}

interface AllyProps {
    boardType: Side.Ally;
    shipYard: BattleshipAllyYard;
}

interface EnemyProps {
    boardType: Side.Enemy;
    shipYard: BattleshipYard;
}

const Board: React.FC<Props> = ({
    boardType,
    shipYard,
    selectable,
    validate,
    availability,
    onSquareHoverEnd,
    onSquareHoverStart,
    onSquareClick,
}) => {
    const { board } = useGameStateContext().state;

    const mappedBattleshipPart = useMemo(() => {
        if (boardType === Side.Ally)
            return mapPosToBattleshipPart(
                shipYard as BattleshipAllyYard,
                validate
            );
        return mapPosToBattleshipPart(
            shipYard.filter(
                ({ status }) => status !== BattleshipStatus.Hidden
            ) as BattleshipAllyYard,
            validate
        );
    }, [shipYard, boardType, validate]);

    const renderedSquares = useMemo(() => {
        return generateArrayOfNumbers(board.gridSize).map((row) =>
            generateArrayOfNumbers(board.gridSize).map((col) => {
                const position = { row, col };
                const key = posToString(position);

                const isPlacing =
                    mappedBattleshipPart.get(key)?.battleship.status ===
                    BattleshipStatus.Placeholder;

                const isHead =
                    mappedBattleshipPart.get(key)?.partType ===
                    BattleshipPartType.Front;

                const interactive =
                    availability === undefined ||
                    (!isHead && isPlacing) ||
                    (availability !== undefined &&
                        availability[row - 1][col - 1]);

                return (
                    <Square
                        key={key}
                        squareType={boardType}
                        selectable={selectable}
                        position={position}
                        part={mappedBattleshipPart.get(key) || undefined}
                        style={{
                            opacity: interactive ? 1.0 : 0.4,
                            pointerEvents: interactive ? "auto" : "none",
                        }}
                        onClick={(e) =>
                            onSquareClick && onSquareClick(position, e)
                        }
                        onHoverStart={(e) =>
                            onSquareHoverStart &&
                            onSquareHoverStart(position, e)
                        }
                        onHoverEnd={(e) =>
                            onSquareHoverEnd && onSquareHoverEnd(position, e)
                        }
                    />
                );
            })
        );
    }, [
        board.gridSize,
        boardType,
        mappedBattleshipPart,
        selectable,
        availability,
        onSquareClick,
        onSquareHoverEnd,
        onSquareHoverStart,
    ]);

    return <Container gridSize={board.gridSize}>{renderedSquares}</Container>;
};

interface ContainerProps {
    gridSize: number;
}

const Container = styled.div<ContainerProps>`
    z-index: 0;
    display: grid;
    grid-template-columns: repeat(
        ${({ gridSize }) => `${gridSize}`},
        min-content
    );
    grid-template-rows: repeat(${({ gridSize }) => `${gridSize}`}, min-content);
`;

export default Board;
