import { Position } from "./utility";

export enum BoardSquareStatus {
    Default = 0, 
    Missed, 
    Hit, 
}

export interface BoardSquare {
    position: Position; 
    status: BoardSquareStatus; 
}

export type BoardState = BoardSquare[][];