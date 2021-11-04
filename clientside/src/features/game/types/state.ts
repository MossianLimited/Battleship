import { BattleshipState } from "../../board/types/battleship";
import { BoardState } from "../../board/types/board";

export interface GameState {
    meta: MetaState; 
    board: BoardState;
    battleship: BattleshipState;
}

export interface MetaState {
    round: number; 
    turn: number; 
    phase: Phase; 
}

export enum Phase {
    Welcome = 0, 
    Setup, 
    Playing, 
    Finish, 
}