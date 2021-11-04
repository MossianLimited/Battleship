import { GameState, Phase } from "../types/state";
import { DEFAULT_GRID_SIZE } from "./size";

export const initialGameState: GameState = {
    meta: {
        turn: 1, 
        round: 1,
        phase: Phase.Setup,  
        isHost: true, 
    }, 
    board: {
        gridSize: DEFAULT_GRID_SIZE,
        ally: {},
        enemy: {},
    },
    battleship: {
        ally: [], 
        enemy: [], 
    },
};
