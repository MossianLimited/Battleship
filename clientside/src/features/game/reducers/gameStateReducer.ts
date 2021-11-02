import posToString from "../../board/functions/posToString";
import { GameAction } from "../types/action";
import { GameState, MetaPhase } from "../types/state";

const gameStateReducer = (
    prevState: GameState,
    action: GameAction
): GameState => {
    switch (action.type) {
        case "GAME_START": 
            return {
                ...prevState, 
                meta: {
                    ...prevState.meta, 
                    phase: MetaPhase.Playing, 
                }
            }
        case "MARK_SQUARE":
            return {
                ...prevState,
                board: {
                    ...prevState.board,
                    [action.payload.side]: {
                        ...prevState.board[action.payload.side],
                        [posToString(action.payload.position)]: {
                            position: action.payload.position,
                            status: action.payload.status,
                        },
                    },
                },
            };
        default:
            return prevState;
    }
};

export default gameStateReducer;
