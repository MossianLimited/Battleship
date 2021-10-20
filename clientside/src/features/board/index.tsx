import { useMemo } from "react";
import styled from "styled-components";
import Square from "./components/Square";
import { Side } from "./types/utility";
import { UniBoardState } from "./types/board";
import mapPosToBattleshipPart from "./functions/mapPosToBattleshipPart";
import posToString from "./functions/posToString";
import {
    BattleshipAllyYard,
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
        if (boardType === Side.Ally)
            return mapPosToBattleshipPart(shipYard as BattleshipAllyYard);
        return mapPosToBattleshipPart(
            shipYard.filter(
                ({ status }) => status !== BattleshipStatus.Hidden
            ) as BattleshipAllyYard
        );
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
