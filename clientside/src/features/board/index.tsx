import styled from "styled-components";
import Square from "./components/Square";
import renderGridFromGridSize from "./functions/renderGridFromGridSize";

const GRID_SIZE = 10;
const computedGrid = renderGridFromGridSize(GRID_SIZE);

interface Props {
    boardType: "player" | "enemy";
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
