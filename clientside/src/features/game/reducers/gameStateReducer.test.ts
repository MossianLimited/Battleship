import { BoardSquareStatus } from "../../board/types/board";
import { Side } from "../../board/types/utility";
import { GameAction } from "../types/action";
import { GameState } from "../types/state";
import gameStateReducer from "./gameStateReducer";

describe("gameStateReducer", () => {
    test('Dispatching an action of type "MARK_SQUARE" should mark the square with position and status given in the payload', () => {
        const mockState: GameState = {
            battleship: {
                ally: [],
                enemy: [],
            },
            board: {
                gridSize: 10,
                ally: {},
                enemy: {},
            },
        };
        const action: GameAction = {
            type: "MARK_SQUARE",
            payload: {
                position: {
                    row: 10,
                    col: 10,
                },
                status: BoardSquareStatus.Hit,
                side: Side.Enemy,
            },
        };
        const expectedState: GameState = {
            ...mockState,
            board: {
                ...mockState.board,
                enemy: {
                    "10,10": {
                        status: BoardSquareStatus.Hit,
                        position: {
                            row: 10,
                            col: 10,
                        },
                    },
                },
            },
        };
        expect(gameStateReducer(mockState, action)).toStrictEqual(
            expectedState
        );
    });
});
