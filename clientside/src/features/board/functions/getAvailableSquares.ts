import { BattleshipDirection, BattleshipKnown } from "../types/battleship";
import { Position } from "../types/utility";

const safeSet = <T>(arr: T[][], value: T, row: number, col: number) => {
    const gridSize = arr.length;
    if (row >= gridSize || row < 0 || col >= gridSize || col < 0) return;
    else arr[row][col] = value;
};

const getDeltaFromDirection = (dir: BattleshipDirection): Position => {
    let deltaX = 0,
        deltaY = 0;

    if (dir === BattleshipDirection.Horizontal) deltaX = 1;
    else if (dir === BattleshipDirection.HorizontalRev) deltaX = -1;

    if (dir === BattleshipDirection.Vertical) deltaY = 1;
    else if (dir === BattleshipDirection.VerticalRev) deltaY = -1;

    return { row: deltaY, col: deltaX };
};

const getAvailableSquares = (
    length: number,
    direction: BattleshipDirection,
    shipyard: BattleshipKnown[],
    gridSize: number = 8
) => {
    const board: boolean[][] = [];

    for (let i = 0; i < gridSize; i++) {
        board.push([]);
        for (let j = 0; j < gridSize; j++) {
            board[i].push(true);
        }
    }

    shipyard.forEach((ship) => {
        const delta = getDeltaFromDirection(ship.direction);
        let pos = { ...ship.position };

        for (let i = 0; i < ship.length; i++) {
            const row = pos.row - 1;
            const col = pos.col - 1;

            for (let x = -1; x <= 1; x++)
                for (let y = -1; y <= 1; y++)
                    safeSet(board, false, row + y, col + x);

            pos = {
                row: pos.row + delta.row,
                col: pos.col + delta.col,
            };
        }
    });

    const visited = board.map((x) => x.map((y) => !y));
    const delta = getDeltaFromDirection(direction);
    const sum = delta.row + delta.col;
    const begin = sum >= 0 ? gridSize - 1 : 0;
    const end = sum >= 0 ? -1 : gridSize;

    const search = (i: number, j: number, depth: number) => {
        if (i >= gridSize || j >= gridSize || i < 0 || j < 0) return;
        if (visited[i][j]) return;
        else visited[i][j] = true;
        if (depth < length) board[i][j] = false;
        search(i - delta.row, j - delta.col, depth + 1);
    };

    for (let i = begin; i !== end; i -= sum) {
        for (let j = begin; j !== end; j -= sum) {
            board[i][j] && search(i, j, 1);
        }
    }

    return board;
};

export default getAvailableSquares;
