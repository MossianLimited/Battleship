import {
    BattleshipAllyYard,
    BattleshipDirection,
    BattleshipStatus,
} from "../../board/types/battleship";
import deserializePlacements from "./deserializePlacements";

describe("deserializePlacements()", () => {
    beforeEach(() => {
        jest.spyOn(global.Math, "random")
            .mockReturnValueOnce(0.25)
            .mockReturnValueOnce(0.75)
            .mockReturnValueOnce(0.75)
            .mockReturnValueOnce(0.25);
    });

    afterEach(() => {
        jest.spyOn(global.Math, 'random').mockRestore(); 
    }); 

    test("Deserialize single battleship placement correctly.", () => {
        const mock: string[][] = [["A1", "A2", "A3", "A4"]];

        const output = [
            {
                name: "1",
                length: 4,
                position: { row: 1, col: 1 },
                status: BattleshipStatus.Default,
                direction: BattleshipDirection.Vertical,
            },
        ];

        const outputRev = [
            {
                name: "1",
                length: 4,
                position: { row: 4, col: 1 },
                status: BattleshipStatus.Default,
                direction: BattleshipDirection.VerticalRev,
            },
        ];

        expect(deserializePlacements(mock)).toStrictEqual(output);
        expect(deserializePlacements(mock)).toStrictEqual(outputRev);
    });

    test("Deserialize multiple battleship placements correctly.", () => {
        const mock: string[][] = [
            ["A1", "A2", "A3", "A4"],
            ["C2", "D2", "E2", "F2"],
            ["C4", "C5", "C6", "C7"],
            ["H1", "H2", "H3", "H4"],
        ];

        const output = [
            {
                name: "1",
                length: 4,
                position: { row: 1, col: 1 },
                status: BattleshipStatus.Default,
                direction: BattleshipDirection.Vertical,
            },
            {
                name: "2",
                length: 4,
                position: { row: 2, col: 6 },
                status: BattleshipStatus.Default,
                direction: BattleshipDirection.HorizontalRev,
            },
            {
                name: "3",
                length: 4,
                position: { row: 7, col: 3 },
                status: BattleshipStatus.Default,
                direction: BattleshipDirection.VerticalRev,
            },
            {
                name: "4",
                length: 4,
                position: { row: 1, col: 8 },
                status: BattleshipStatus.Default,
                direction: BattleshipDirection.Vertical,
            },
        ];

        expect(deserializePlacements(mock)).toStrictEqual(output);
    });
});
