import { Side, Position } from "./utility";

export enum BattleshipDirection {
    Vertical = 0, 
    Horizontal,
    VerticalRev, 
    HorizontalRev, 
}

export enum BattleshipStatus {
    Default = 0, 
    Hidden, 
    Sunken, 
}

export interface BattleshipBase {
    name: string; 
    length: number; 
    status: BattleshipStatus; 
}

export interface BattleshipKnown extends BattleshipBase {
    position: Position; 
    direction: BattleshipDirection; 
}

export interface BattleshipAlly extends BattleshipKnown {
    status: BattleshipStatus.Default; 
}

export interface BattleshipSunken extends BattleshipKnown {
    status: BattleshipStatus.Sunken; 
}

export interface BattleshipHidden extends BattleshipBase {
    status: BattleshipStatus.Hidden; 
}

export type BattleshipYard = BattleshipBase[];

export type BattleshipState = Record<Side, BattleshipYard>; 