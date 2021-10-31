import { Position } from "./utility";

export enum BattleshipType {
    Default,
    Submarine,
    ACC,
}

export enum BattleshipPartType {
    Front = 0,
    Middle,
    Back,
    Single,
}

export enum BattleshipDirection {
    Vertical = 0,
    Horizontal = 1,
    VerticalRev = 2,
    HorizontalRev = 3,
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

export type BattleshipAllyYard = (BattleshipAlly | BattleshipSunken)[];

export type BattleshipYard = (
    | BattleshipAlly
    | BattleshipSunken
    | BattleshipHidden
)[];

export interface BattleshipState {
    ally: BattleshipAllyYard;
    enemy: BattleshipYard;
}

/**
 * Rendering State Wrapper
 */

export interface BattleshipPartRdState {
    battleship: BattleshipKnown;
    partType: BattleshipPartType;
}
