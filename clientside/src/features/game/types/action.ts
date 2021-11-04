import {
    BattleshipAllyYard,
    BattleshipKnown,
} from "../../board/types/battleship";
import { BoardSquareStatus } from "../../board/types/board";
import { Position, Side } from "../../board/types/utility";

type GameStartAction = {
    type: "GAME_START";
    payload: {
        shipyard: BattleshipAllyYard;
    };
};

type MarkSquareAction = {
    type: "MARK_SQUARE";
    payload: {
        side: Side;
        position: Position;
        status: BoardSquareStatus.Hit | BoardSquareStatus.Missed;
    };
};

type SunkShipAction = {
    type: "SUNK_SHIP";
    payload: {
        side: Side;
        battleship: BattleshipKnown;
    };
};

type ResetBoardAction = {
    type: "RESET_BOARD";
};

export type GameAction =
    | GameStartAction
    | MarkSquareAction
    | SunkShipAction
    | ResetBoardAction;
