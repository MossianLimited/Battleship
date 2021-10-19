import { BoardSquare, BoardSquareStatus } from "../types/board";

// Creates a 1D array with elements as objects with 'row' and 'column' keys from gridSize
const renderGridFromGridSize = (gridSize: number): BoardSquare[] => {
    const grid: BoardSquare[] = [];
    for (let row = 1; row <= gridSize; row++) {
        for (let col = 1; col <= gridSize; col++) {
            grid.push({ position: { row, col }, status: BoardSquareStatus.Default });
        }
    }
    return grid;
};

export default renderGridFromGridSize;
