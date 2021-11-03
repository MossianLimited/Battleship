import { Position } from "../types/utility"

const COLUMN: string[] = ["A", "B", "C", "D", "E", "F", "G", "H"];

const serializePos = (pos: Position): string => {
    const col = COLUMN[pos.col - 1]; 
    const row = pos.row.toString(); 
    return `${col}${row}`;
}

export default serializePos; 