import { Position } from "../types/utility";
import posToString from "./posToString";

describe("posToString", () => {
    test("Converting a position to string should return the position as a comma separated string", () => {
        const mockInput: Position = {
            row: 2,
            col: 1,
        };
        const expectedOutput: string = "2,1";
        expect(posToString(mockInput)).toStrictEqual(expectedOutput);
    });
});
