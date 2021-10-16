export interface ISquare {
    position: {
        row: number;
        col: number;
    };
}

export type SquareType = "player" | "enemy";
