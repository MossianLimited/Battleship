import { Position, Side } from "./utility";

export enum BoardSquareStatus {
    Default = 0,
    Missed,
    Hit,
}

export interface BoardSquare {
    position: Position;
    status: BoardSquareStatus;
}

export type UniBoardState = BoardSquare[];

export type BoardState = Record<Side, UniBoardState>;
