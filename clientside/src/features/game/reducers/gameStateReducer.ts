import posToString from "../../board/functions/posToString";
import { GameAction } from "../types/action";
import { GameState } from "../types/state";

const gameStateReducer = (
    prevState: GameState,
    action: GameAction
): GameState => {
    switch (action.type) {
        case "GAME_START": 
            return {
                ...prevState, 
                battleship: {
                    ...prevState.battleship, 
                    ally: action.payload.shipyard, 
                    enemy: [],
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
