import serializePlacements from "./serializePlacements";
import {
    BattleshipDirection,
    BattleshipStatus,
} from "../../board/types/battleship";

describe("serializePlacements()", () => {
    test("Serialize single battleship placement correctly.", () => {
        const mock = [
            {
                name: "1",
                length: 4,
                position: { row: 1, col: 1 },
                status: BattleshipStatus.Default,
                direction: BattleshipDirection.Vertical,
            },
        ];
        
        const output: string[][] = [["A1", "A2", "A3", "A4"]];
        expect(serializePlacements(mock)).toStrictEqual(output);
    });

    test("Serialize multiple battleship placements correctly.", () => {
        const output: string[][] = [
            ["A1", "A2", "A3", "A4"],
            ["F2", "E2", "D2", "C2"],
            ["C7", "C6", "C5", "C4"],
            ["H1", "H2", "H3", "H4"],
        ];

        const mock = [
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

        expect(serializePlacements(mock)).toStrictEqual(output);
    });
});
