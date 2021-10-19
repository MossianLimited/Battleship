import { BoardSquare, BoardSquareStatus } from "../types/board";
import renderGridFromGridSize from "./renderGridFromGridSize";

describe("renderGridFromGridSize", () => {
    test("Creating a 2x2 grid should return a 1D array with elements as objects with 'row' and 'column' keys", () => {
        const expectedOutput: BoardSquare[] = [
            { position: { row: 1, col: 1 }, status: BoardSquareStatus.Default },
            { position: { row: 1, col: 2 }, status: BoardSquareStatus.Default },
            { position: { row: 2, col: 1 }, status: BoardSquareStatus.Default },
            { position: { row: 2, col: 2 }, status: BoardSquareStatus.Default },
        ];
        expect(renderGridFromGridSize(2)).toStrictEqual(expectedOutput);
    });
});
