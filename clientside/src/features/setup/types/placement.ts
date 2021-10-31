import { BattleshipHidden, BattleshipKnown } from "../../board/types/battleship";

export enum PlacementStatus {
    Placed = 0,
    Placing, 
    Undecided, 
}

export type Placement =
    | {
          battleship: BattleshipKnown;
          selected: boolean; 
          status: PlacementStatus.Placed | PlacementStatus.Placing;
      }
    | {
          battleship: BattleshipHidden;
          selected: boolean; 
          status: PlacementStatus.Undecided;
      };

export type PlacementList = Placement[];
