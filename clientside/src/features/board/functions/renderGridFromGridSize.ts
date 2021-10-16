import { ISquare } from "../types/square";

// Creates a 1D array with elements as objects with 'row' and 'column' keys from gridSize
const renderGridFromGridSize = (gridSize: number): ISquare[] => {
    const grid: ISquare[] = [];
    for (let row = 1; row <= gridSize; row++) {
        for (let col = 1; col <= gridSize; col++) {
            grid.push({ position: { row, col } });
        }
    }
    return grid;
};

export default renderGridFromGridSize;
