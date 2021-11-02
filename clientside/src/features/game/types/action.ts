import { BoardSquareStatus } from "../../board/types/board";
import { Position, Side } from "../../board/types/utility";

type GameStartAction = {
    type: "GAME_START"
}

type MarkSquareAction = {
    type: "MARK_SQUARE";
    payload: {
        side: Side;
        position: Position;
        status: BoardSquareStatus.Hit | BoardSquareStatus.Missed;
    };
};



export type GameAction = GameStartAction | MarkSquareAction;
