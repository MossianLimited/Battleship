import { BattleshipHidden, BattleshipStatus } from '../../board/types/battleship'
import { PlacementList, PlacementStatus } from '../types/placement'

export const INIT_BATTLESHIP: BattleshipHidden = {
    name: '0', 
    length: 4, 
    status: BattleshipStatus.Hidden, 
}

export const INIT_PLACEMENT_LIST: PlacementList = [
    {
        selected: false, 
        status: PlacementStatus.Undecided, 
        battleship: {
            ...INIT_BATTLESHIP, 
            name: '1', 
        },
    },
    {
        selected: false, 
        status: PlacementStatus.Undecided, 
        battleship: {
            ...INIT_BATTLESHIP, 
            name: '2', 
        },
    },
    {
        selected: false, 
        status: PlacementStatus.Undecided, 
        battleship: {
            ...INIT_BATTLESHIP, 
            name: '3', 
        },
    },
    {
        selected: false, 
        status: PlacementStatus.Undecided, 
        battleship: {
            ...INIT_BATTLESHIP, 
            name: '4', 
        },
    }
]