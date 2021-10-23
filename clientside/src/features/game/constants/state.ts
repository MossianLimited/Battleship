import renderBattleshipTemplate from "../../board/functions/renderBattleshipTemplate";
import { GameState } from "../types/state";
import { DEFAULT_GRID_SIZE } from "./size";

export const initialGameState: GameState = {
    battleship: renderBattleshipTemplate(),
    board: {
        gridSize: DEFAULT_GRID_SIZE,
        ally: {},
        enemy: {},
    },
};
