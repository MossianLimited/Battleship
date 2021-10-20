import {
    BattleshipAllyYard,
    BattleshipDirection,
    BattleshipState,
    BattleshipStatus,
    BattleshipYard, 
} from "../types/battleship";

const DEFAULT_ALLY_SHIPYARD: BattleshipAllyYard = [
    {
        name: "5x1",
        length: 5,
        position: { row: 2, col: 2 },
        status: BattleshipStatus.Default,
        direction: BattleshipDirection.Vertical,
    },
    {
        name: "4x1",
        length: 4,
        position: { row: 5, col: 4 },
        status: BattleshipStatus.Default,
        direction: BattleshipDirection.Horizontal,
    },
    {
        name: "3x1",
        length: 3,
        position: { row: 1, col: 7 },
        status: BattleshipStatus.Default,
        direction: BattleshipDirection.Vertical,
    },
    {
        name: "2x1(1)",
        length: 2,
        position: { row: 8, col: 7 },
        status: BattleshipStatus.Default,
        direction: BattleshipDirection.Horizontal,
    },
    {
        name: "2x1(2)",
        length: 2,
        position: { row: 7, col: 5 },
        status: BattleshipStatus.Default,
        direction: BattleshipDirection.Vertical,
    },
    {
        name: "1x1",
        length: 1,
        position: { row: 9, col: 2 },
        status: BattleshipStatus.Default,
        direction: BattleshipDirection.Horizontal,
    },
];

const DEFAULT_ENEMY_SHIPYARD: BattleshipYard = [
    {
        name: "5x1",
        length: 5,
        status: BattleshipStatus.Hidden,
    },
    {
        name: "4x1",
        length: 4,
        status: BattleshipStatus.Hidden,
    },
    {
        name: "3x1",
        length: 3,
        status: BattleshipStatus.Hidden,
    },
    {
        name: "2x1(1)",
        length: 2,
        status: BattleshipStatus.Hidden,
    },
    {
        name: "2x1(2)",
        length: 2,
        status: BattleshipStatus.Hidden,
    },
    {
        name: "1x1",
        length: 1,
        status: BattleshipStatus.Hidden,
    },
];

export const renderAllyBattleshipTemplate = (): BattleshipAllyYard => {
    return DEFAULT_ALLY_SHIPYARD; 
};

export const renderEnemyBattleshipTemplate = (): BattleshipYard => {
    return DEFAULT_ENEMY_SHIPYARD; 
};

const renderBattleshipTemplate = (): BattleshipState => {
    return {
        ally: DEFAULT_ALLY_SHIPYARD, 
        enemy: DEFAULT_ENEMY_SHIPYARD, 
    }
}

export default renderBattleshipTemplate; 