import { Position, Side } from "./utility";

export enum BoardSquareStatus {
    Missed,
    Hit,
}

export interface ContactedBoardSquare {
    position: Position;
    status: BoardSquareStatus;
}

export type UniBoardState = Record<string, ContactedBoardSquare>; // key = posToString(position)

export type BoardState = {
    gridSize: number;
} & Record<Side, UniBoardState>;
