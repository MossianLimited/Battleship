import posToString from "../../board/functions/posToString";
import { BattleshipStatus } from "../../board/types/battleship";
import { Side } from "../../board/types/utility";
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
                },
            };
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
        case "SUNK_SHIP":
            if (action.payload.side === Side.Enemy) {
                const length = prevState.battleship.enemy.length;
                return {
                    ...prevState,
                    battleship: {
                        ...prevState.battleship,
                        enemy: [
                            ...prevState.battleship.enemy,
                            {
                                ...action.payload.battleship, 
                                name: length.toString(), 
                                status: BattleshipStatus.Sunken
                            },
                        ],
                    },
                };
            }
    
            const length = prevState.battleship.ally.length; 
            const index = prevState.battleship.ally.findIndex(
                (s) =>
                    s.position.col === action.payload.battleship.position.col &&
                    s.position.row === action.payload.battleship.position.row
            );

            if (index === -1)
                throw new Error('Unexpected sunked ship reported by server'); 

            return {
                ...prevState,
                battleship: {
                    ...prevState.battleship, 
                    ally: [
                        ...prevState.battleship.ally.slice(0, index),
                        {
                            ...action.payload.battleship, 
                            name: length.toString(), 
                            status: BattleshipStatus.Sunken, 
                        }, 
                        ...prevState.battleship.ally.slice(index + 1),
                    ]
                },
            };
        default:
            return prevState;
    }
};

export default gameStateReducer;
