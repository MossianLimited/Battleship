import { Position } from "../types/utility";

function posToString({ row, col }: Position): string {
    return `${row},${col}`;
}

export default posToString; 