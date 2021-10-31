import { FC, MouseEvent, useState, useEffect } from "react";
import styled from "styled-components";
import Board from "../board";
import { Position, Side } from "../board/types/utility";
import Ship from "./components/ship";
import Refresh from "./components/refresh";
import { INIT_PLACEMENT_LIST } from "./constants/list";
import { PlacementList, PlacementStatus } from "./types/placement";
import {
    BattleshipAllyYard,
    BattleshipBase,
    BattleshipDirection,
    BattleshipStatus,
} from "../board/types/battleship";

const SetupModal: FC = (_) => {
    const [placements, setPlacements] =
        useState<PlacementList>(INIT_PLACEMENT_LIST);

    const onShipClick = (battleship: BattleshipBase, _e: MouseEvent) => {
        const index = placements.findIndex((p) => p.battleship === battleship);
        const nextPlacements = placements.map((p, i) => {
            if (i === index) return { ...p, selected: true };
            return { ...p, selected: false };
        });

        setPlacements(nextPlacements);
    };

    const onSquareHoverStart = (position: Position, _e: MouseEvent) => {
        const index = placements.findIndex((p) => p.selected);

        if (index === -1) return;

        const nextPlacements: PlacementList = placements.map((p, i) => {
            if (i !== index) return p;

            const direction = p.status === PlacementStatus.Placing 
                ? p.battleship.direction
                : BattleshipDirection.Vertical;

            return {
                battleship: {
                    ...p.battleship,
                    position,
                    direction, 
                    status: BattleshipStatus.Default,
                },
                selected: p.selected,
                status: PlacementStatus.Placing,
            };
        });

        setPlacements(nextPlacements);
    };

    const onSquareHoverEnd = (_position: Position, _e: MouseEvent) => {
        const index = placements.findIndex((p) => p.selected);

        if (index === -1) return;

        const nextPlacements: PlacementList = placements.map((p, i) => {
            if (i !== index) return p;
            return {
                battleship: {
                    name: p.battleship.name,
                    length: p.battleship.length,
                    status: BattleshipStatus.Hidden,
                },
                selected: p.selected,
                status: PlacementStatus.Undecided,
            };
        });

        setPlacements(nextPlacements);
    };

    const onSquareClick = (_position: Position, _e: MouseEvent) => {
        const index = placements.findIndex((p) => p.selected);

        if (index === -1) return;

        const nextPlacements: PlacementList = placements.map((p, i) => {
            if (i !== index || p.battleship.status === BattleshipStatus.Hidden)
                return p;

            return {
                battleship: {
                    ...p.battleship,
                    status: BattleshipStatus.Default,
                },
                selected: false,
                status: PlacementStatus.Placed,
            };
        });

        setPlacements(nextPlacements);
    };

    const onReset = (_e: MouseEvent) => {
        setPlacements(INIT_PLACEMENT_LIST);
    };

    const renderedShip = placements.map((p) => (
        <Ship
            key={p.battleship.name}
            battleship={p.battleship}
            selected={p.selected}
            status={p.status}
            onClick={(e) => onShipClick(p.battleship, e)}
        />
    ));

    const renderedShipyard = placements
        .filter((p) => p.battleship.status === BattleshipStatus.Default)
        .map((p) => p.battleship) as BattleshipAllyYard;

    useEffect(() => {
        const fn = (e: KeyboardEvent) => {
            if (e.code === "Space") {
                const index = placements.findIndex((p) => p.selected);

                if (index === -1) return;

                const nextPlacements: PlacementList = placements.map((p, i) => {
                    if (i !== index || p.status === PlacementStatus.Undecided) return p;
                    return {
                        battleship: {
                            ...p.battleship,
                            direction: (p.battleship.direction + 1) % 4, 
                        },
                        selected: p.selected,
                        status: PlacementStatus.Placing,
                    };
                });

                setPlacements(nextPlacements);
            }
        };

        document.addEventListener('keypress', fn); 
        return () => document.removeEventListener('keypress', fn);
    }, [placements]);

    return (
        <Wrapper>
            <HeaderWrapper>
                <HeaderText>Plan your ship positions...</HeaderText>
                <RandomButton>
                    <Refresh />
                    Random
                </RandomButton>
            </HeaderWrapper>
            <Spacer />
            <BodyWrapper>
                <ShipyardWrapper>
                    <ShipyardText>Shipyard</ShipyardText>
                    {renderedShip}
                </ShipyardWrapper>
                <BoardWrapper>
                    <Board
                        validate={false}
                        selectable={false}
                        boardType={Side.Ally}
                        shipYard={renderedShipyard}
                        onSquareHoverStart={onSquareHoverStart}
                        onSquareHoverEnd={onSquareHoverEnd}
                        onSquareClick={onSquareClick}
                    ></Board>
                    <ResetButton onClick={onReset}>Reset</ResetButton>
                </BoardWrapper>
            </BodyWrapper>
            <Spacer />
            <ReadyButton>Ready!</ReadyButton>
        </Wrapper>
    );
};

export default SetupModal;

const Spacer = styled.div``;

const Wrapper = styled.div`
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: min-content 3rem minmax(0, 19rem) 1.5rem min-content;
    padding: 1.75rem;
    border-radius: 1rem;
    height: auto;
    position: absolute;
    background: #674def;
`;

const HeaderWrapper = styled.div`
    border-radius: 12px;
    display: flex;
    background: #7b61ff;
    flex-flow: row;
    padding: 1rem 1.5rem;
    align-items: center;
    justify-content: space-between;
`;

const HeaderText = styled.div`
    font-size: 1rem;
    font-weight: 600;
    color: white;
`;

const RandomButton = styled.button`
    outline: none;
    font-size: 1rem;
    padding: 0.5rem 0.75rem;
    border-radius: 100px;
    height: 2rem;
    display: inline-flex;
    flex-flow: row;
    align-items: center;
    justify-content: center;
    background: #674def;
    transition: transform 300ms ease;
    transform: scaleX(1) scaleY(1);
    color: white;
    cursor: pointer;
    font-weight: 600;

    &:hover {
        transform: scaleX(1.04) scaleY(1.08);
    }
`;

const BodyWrapper = styled.div`
    display: flex;
    flex-flow: row;
    height: 100%;
`;

const ShipyardWrapper = styled.div`
    position: relative;
    display: flex;
    flex-flow: column wrap;
    flex-grow: 1;
    height: 100%;
    margin-right: 3rem;
    align-items: center;
    align-content: center;
    justify-content: center;
    width: 6rem;
    background: #7b61ff;
    border-radius: 12px;
`;

const ShipyardText = styled.span`
    position: absolute;
    top: -1.75rem;
    color: #bbb3e0;
    font-weight: 500;
    font-size: 1rem;
    margin-bottom: 1rem;
`;

const BoardWrapper = styled.div`
    position: relative;
`;

const ReadyButton = styled.button`
    background: #fff06b;
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    border-radius: 12px;
    height: 48px;
    color: #4328c9;
    font-weight: 700;
    cursor: pointer;
    transform: scale(1);
    transition: all 300ms ease;
    font-size: 1.125rem;

    &:hover {
        transform: scale(1.04);
    }
`;

const ResetButton = styled.button`
    outline: none;
    font-size: 1rem;
    padding: 0.5rem 0.75rem;
    border-radius: 100px;
    height: 2rem;
    display: inline-flex;
    flex-flow: row;
    align-items: center;
    justify-content: center;
    background: #7b61ff;
    transition: transform 300ms ease;
    transform: scaleX(1) scaleY(1);
    color: white;
    cursor: pointer;
    font-weight: 500;
    width: 100%; 
    position: absolute; 
    bottom: 0; 

    &:hover {
        transform: scaleX(1.04) scaleY(1.08);
    }
`;
