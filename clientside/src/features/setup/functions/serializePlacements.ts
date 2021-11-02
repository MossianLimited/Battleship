import { BattleshipKnown } from "../../board/types/battleship";
import { Position } from "../../board/types/utility";

const COLUMN: string[] = ["A", "B", "C", "D", "E", "F", "G", "H"];
const DELTA: Position[] = [
    { row: 1, col: 0 },
    { row: 0, col: 1 },
    { row: -1, col: 0 },
    { row: 0, col: -1 },
];

const serializePlacements = (shipyard: BattleshipKnown[]): string[][] => {
    return shipyard.map((ship) => {
        const { position, direction } = ship; 
        const delta = DELTA[direction]; 

        let cells: string[] = [];
        let origin = { ...position }; 
        for (let i = 0; i < ship.length; i++){
            cells.push(`${COLUMN[origin.col - 1]}${origin.row}`); 
            origin.col += delta.col; 
            origin.row += delta.row; 
        }

        return cells; 
    });
};

export default serializePlacements;
