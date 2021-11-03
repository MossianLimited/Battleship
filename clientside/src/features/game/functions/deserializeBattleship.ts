import {
    BattleshipDirection,
    BattleshipKnown,
    BattleshipStatus,
} from "../../board/types/battleship";
import { Position } from "../../board/types/utility";

const COLUMN: { [index: string]: number } = {
    A: 1,
    B: 2,
    C: 3,
    D: 4,
    E: 5,
    F: 6,
    G: 7,
    H: 8,
};

const stringToPos = (s: string): Position => {
    const col = COLUMN[s[0].toUpperCase()];
    const row = parseInt(s[1]);

    return { row, col };
};

const deserializeBattleship = (ship: string[]): BattleshipKnown => {
    const pos = ship.map((j) => stringToPos(j));

    const deltaY = pos[1].row - pos[0].row;
    const deltaX = pos[1].col - pos[0].col;

    const reverse = deltaX + deltaY < 0;
    const axis =
        deltaY !== 0
            ? BattleshipDirection.Vertical
            : BattleshipDirection.Horizontal;

    const direction = (reverse ? axis + 2 : axis) as BattleshipDirection;
    
    return {
        direction,
        name: "",
        position: pos[0],
        length: pos.length,
        status: BattleshipStatus.Default,
    };
};

export default deserializeBattleship; 