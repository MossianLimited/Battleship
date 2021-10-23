import { BattleshipState } from "../../board/types/battleship";
import { BoardState } from "../../board/types/board";

export interface GameState {
    board: BoardState;
    battleship: BattleshipState;
}
