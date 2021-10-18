import styled from "styled-components";
import Square from "./components/Square";
import renderGridFromGridSize from "./functions/renderGridFromGridSize";

const GRID_SIZE = 10;
const computedGrid = renderGridFromGridSize(GRID_SIZE);

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

interface Props {
    boardType: "ally" | "enemy";
}

const Board: React.FC<Props> = ({ boardType }) => {
    const displayedSquares = computedGrid.map(({ position }) => {
        return (
            <Square
                key={JSON.stringify(position)}
                squareType={boardType}
                position={position}
            />
        );
    });

    return <Container>{displayedSquares}</Container>;
};

const Container = styled.div`
    display: grid;
    grid-template-columns: repeat(${GRID_SIZE}, min-content);
    grid-template-rows: repeat(${GRID_SIZE}, min-content);
`;

export default Board;
