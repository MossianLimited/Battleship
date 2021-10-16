import { ISquare } from "../types/square";
import renderGridFromGridSize from "./renderGridFromGridSize";

describe("renderGridFromGridSize", () => {
    test("Creating a 2x2 grid should return a 1D array with elements as objects with 'row' and 'column' keys", () => {
        const expectedOutput: ISquare[] = [
            { position: { row: 1, col: 1 } },
            { position: { row: 1, col: 2 } },
            { position: { row: 2, col: 1 } },
            { position: { row: 2, col: 2 } },
        ];
        expect(renderGridFromGridSize(2)).toStrictEqual(expectedOutput);
    });
});
