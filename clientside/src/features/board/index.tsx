import { useMemo } from "react";
import styled from "styled-components";
import Square from "./components/Square";
import mapPosToBattleshipPart from "./functions/mapPosToBattleshipPart";
import posToString from "./functions/posToString";
import {
    BattleshipAllyYard,
    BattleshipStatus,
    BattleshipYard,
} from "./types/battleship";
import { Side } from "./types/utility";
import { useGameStateContext } from "../game/contexts/gameStateContext";
import generateArrayOfNumbers from "./functions/generateArrayOfNumbers";

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
    boardType: Side.Ally;
    shipYard: BattleshipAllyYard;
    selectable?: boolean; 
}

interface EnemyProps {
    boardType: Side.Enemy;
    shipYard: BattleshipYard;
    selectable?: boolean; 
}

const Board: React.FC<Props> = ({ boardType, shipYard, selectable }) => {
    const { board } = useGameStateContext().state;

    const mappedBattleshipPart = useMemo(() => {
        if (boardType === Side.Ally)
            return mapPosToBattleshipPart(shipYard as BattleshipAllyYard);
        return mapPosToBattleshipPart(
            shipYard.filter(
                ({ status }) => status !== BattleshipStatus.Hidden
            ) as BattleshipAllyYard
        );
    }, [shipYard, boardType]);

    const renderedSquares = useMemo(() => {
        return generateArrayOfNumbers(board.gridSize).map((row) =>
            generateArrayOfNumbers(board.gridSize).map((col) => {
                const position = { row, col };
                const key = posToString(position);
                return (
                    <Square
                        key={key}
                        squareType={boardType}
                        selectable={selectable}
                        position={position}
                        part={mappedBattleshipPart.get(key) || undefined}
                    />
                );
            })
        );
    }, [board.gridSize, boardType, mappedBattleshipPart, selectable]);

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
