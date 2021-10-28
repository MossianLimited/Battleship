import { createContext, useContext } from "react";
import { GameAction } from "../types/action";
import { GameState, MetaPhase } from "../types/state";

// initializes with empty Product
export const GameStateContext = createContext<{
    state: GameState;
    dispatch: React.Dispatch<GameAction>;
}>({
    state: {
        meta: {
            turn: 1,
            round: 1,
            phase: MetaPhase.Setup,
        },
        board: {
            ally: {},
            enemy: {},
            gridSize: 0,
        },
        battleship: {
            ally: [],
            enemy: [],
        },
    },
    dispatch: () => {},
});

export const useGameStateContext = () => useContext(GameStateContext);
