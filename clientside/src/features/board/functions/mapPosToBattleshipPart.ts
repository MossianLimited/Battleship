import posToString from "./posToString";
import {
    BattleshipAllyYard,
    BattleshipDirection,
    BattleshipPartType,
    BattleshipPartRdState,
} from "../types/battleship";

function mapPosToBattleshipPart(
    shipYard: BattleshipAllyYard, 
    validate: boolean = true, 
): Map<string, BattleshipPartRdState | undefined> {
    const map: Map<string, BattleshipPartRdState | undefined> = new Map();

    shipYard.forEach((battleship) => {
        const { length, direction } = battleship;
        const position = { ...battleship.position };

        for (let i = 0; i < length; i++) {
            if (validate) {
                if (map.has(posToString(position)))
                    throw Error("The ally grid has overlapped battleships.");
    
                for (let j = 0; j < 9; j++) {
                    const rowOffset = Math.floor(j / 3) - 1;
                    const colOffset = (j % 3) - 1;
    
                    if (rowOffset === 0 && colOffset === 0) continue;
    
                    const targetPosition = {
                        col: position.col + colOffset,
                        row: position.row + rowOffset,
                    };
    
                    const potentialAdjacent = map.get(posToString(targetPosition));
                    if (
                        potentialAdjacent &&
                        potentialAdjacent.battleship !== battleship
                    )
                        throw Error("Two ships are too close to each other.");
                }
            }

            let partType: BattleshipPartType;

            if (i === 0) partType = BattleshipPartType.Front;
            else if (i === length - 1) partType = BattleshipPartType.Back;
            else partType = BattleshipPartType.Middle;

            if (length === 1) partType = BattleshipPartType.Single;

            map.set(posToString(position), {
                battleship,
                partType,
            });

            switch (direction) {
                case BattleshipDirection.Vertical:
                    position.row++;
                    break;
                case BattleshipDirection.Horizontal:
                    position.col++;
                    break;
                case BattleshipDirection.VerticalRev:
                    position.row--;
                    break;
                case BattleshipDirection.HorizontalRev:
                    position.col--;
                    break;
            }
        }
    });

    return map;
}

export default mapPosToBattleshipPart;
