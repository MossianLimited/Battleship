import {
    BattleshipAlly,
    BattleshipDirection,
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

const deserializePlacements = (ships: string[][]): BattleshipAlly[] => {
    const fmShips = ships.map((i) => i.map((j) => stringToPos(j)));
    const fmShipyard: BattleshipAlly[] = fmShips.map<BattleshipAlly>((pos, index) => {
        const reverse = Math.random() > 0.5;

        const deltaY = pos[1].row - pos[0].row;
        const axis =
            deltaY !== 0
                ? BattleshipDirection.Vertical
                : BattleshipDirection.Horizontal;

        const direction = (reverse ? axis + 2 : axis) as BattleshipDirection;
        const head = reverse ? pos[pos.length - 1] : pos[0];
        
        return {
            direction, 
            position: head, 
            length: pos.length, 
            name: (index + 1).toString(),
            status: BattleshipStatus.Default, 
        }
    });

    return fmShipyard;
};

export default deserializePlacements;
