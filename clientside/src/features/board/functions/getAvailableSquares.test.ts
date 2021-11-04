import getAvailableSquares from "./getAvailableSquares";
import {
    BattleshipDirection,
    BattleshipKnown,
    BattleshipStatus,
} from "../types/battleship";

describe("getAvailableSquares()", () => {
    test("Generate available squares for [4-Vertical] given [4-Vertical]", () => {
        const ship: BattleshipKnown = {
            name: "0",
            length: 4,
            status: BattleshipStatus.Default,
            position: { row: 1, col: 2 },
            direction: BattleshipDirection.Vertical,
        };

        const mock = [ship];
        const expected = [
            [0, 0, 0, 1, 1, 1, 1, 1],
            [0, 0, 0, 1, 1, 1, 1, 1],
            [0, 0, 0, 1, 1, 1, 1, 1],
            [0, 0, 0, 1, 1, 1, 1, 1],
            [0, 0, 0, 1, 1, 1, 1, 1],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
        ].map((x) => x.map((y) => !!y));

        expect(getAvailableSquares(4, 0, mock)).toStrictEqual(expected);
    });

    test("Generate available squares for [4-VerticalRev] given [4-Horizontal]", () => {
        const ship: BattleshipKnown = {
            name: "0",
            length: 4,
            status: BattleshipStatus.Default,
            position: { row: 4, col: 2 },
            direction: BattleshipDirection.Horizontal,
        };

        const mock = [ship];
        const expected = [
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 1, 1],
            [0, 0, 0, 0, 0, 0, 1, 1],
            [0, 0, 0, 0, 0, 0, 1, 1],
            [0, 0, 0, 0, 0, 0, 1, 1],
            [0, 0, 0, 0, 0, 0, 1, 1],
        ].map((x) => x.map((y) => !!y));

        expect(getAvailableSquares(4, 2, mock)).toStrictEqual(expected);
    });

    test("Generate available squares for [4-Horizontal] given [4-Horizontal] and [4-Vertical]", () => {
        const mock: BattleshipKnown[] = [
            {
                name: "0",
                length: 4,
                status: BattleshipStatus.Default,
                position: { row: 2, col: 2 },
                direction: BattleshipDirection.Vertical,
            },
            {
                name: "1",
                length: 4,
                status: BattleshipStatus.Default,
                position: { row: 7, col: 2 },
                direction: BattleshipDirection.Horizontal,
            },
        ];

        const expected = [
            [0, 0, 0, 1, 1, 0, 0, 0],
            [0, 0, 0, 1, 1, 0, 0, 0],
            [0, 0, 0, 1, 1, 0, 0, 0],
            [0, 0, 0, 1, 1, 0, 0, 0],
            [0, 0, 0, 1, 1, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
        ].map((x) => x.map((y) => !!y));

        expect(getAvailableSquares(4, 1, mock)).toStrictEqual(expected);
    });

    test("Generate available squares for [4-Horizontal] given [4-Horizontal] and two [4-Vertical]s", () => {
        const mock: BattleshipKnown[] = [
            {
                name: "0",
                length: 4,
                status: BattleshipStatus.Default,
                position: { row: 2, col: 2 },
                direction: BattleshipDirection.Vertical,
            },
            {
                name: "1",
                length: 4,
                status: BattleshipStatus.Default,
                position: { row: 3, col: 8 },
                direction: BattleshipDirection.Vertical,
            },
            {
                name: "2",
                length: 4,
                status: BattleshipStatus.Default,
                position: { row: 7, col: 1 },
                direction: BattleshipDirection.Horizontal,
            },
        ];

        const expected = [
            [0, 0, 0, 1, 1, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
        ].map((x) => x.map((y) => !!y));

        expect(getAvailableSquares(4, 1, mock)).toStrictEqual(expected);
    });

    test("Generate available squares for [4-Vertical] given [4-Horizontal] and two [4-Vertical]s", () => {
        const mock: BattleshipKnown[] = [
            {
                name: "0",
                length: 4,
                status: BattleshipStatus.Default,
                position: { row: 2, col: 2 },
                direction: BattleshipDirection.Vertical,
            },
            {
                name: "1",
                length: 4,
                status: BattleshipStatus.Default,
                position: { row: 3, col: 8 },
                direction: BattleshipDirection.Vertical,
            },
            {
                name: "2",
                length: 4,
                status: BattleshipStatus.Default,
                position: { row: 7, col: 1 },
                direction: BattleshipDirection.Horizontal,
            },
        ];

        const expected = [
            [0, 0, 0, 1, 1, 1, 0, 0],
            [0, 0, 0, 1, 1, 1, 0, 0],
            [0, 0, 0, 0, 0, 1, 0, 0],
            [0, 0, 0, 0, 0, 1, 0, 0],
            [0, 0, 0, 0, 0, 1, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
        ].map((x) => x.map((y) => !!y));

        expect(getAvailableSquares(4, 0, mock)).toStrictEqual(expected);
    });
});
