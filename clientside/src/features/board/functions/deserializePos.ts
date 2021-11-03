import { Position } from "../types/utility"

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

const deserializePos = (pos: string): Position => {
    const col = COLUMN[pos[0]]; 
    const row = parseInt(pos[1]); 
    return { row, col }; 
}

export default deserializePos; 