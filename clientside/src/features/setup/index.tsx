import { FC, MouseEvent, useState, useEffect, useMemo, useCallback } from "react";
import { Position, Side } from "../board/types/utility";
import { PlacementList, PlacementStatus } from "./types/placement";
import { INIT_PLACEMENT_LIST } from "./constants/list";
import styled, { css } from "styled-components";
import Board from "../board";
import Ship from "./components/ship";
import Refresh from "./components/refresh";
import socketClient from "../../api/socketClient";
import deserializePlacements from "./functions/deserializePlacements";
import serializePlacements from "./functions/serializePlacements";
import {
    BattleshipAlly,
    BattleshipAllyYard,
    BattleshipBase,
    BattleshipDirection,
    BattleshipStatus,
} from "../board/types/battleship";
import getAvailableSquares from "../board/functions/getAvailableSquares";
import Left from "../game/components/left";

interface Props {
    onSubmit: (shipyard: BattleshipAllyYard) => void;
}

const SetupModal: FC<Props> = ({ onSubmit }) => {
    const [placements, setPlacements] = useState(INIT_PLACEMENT_LIST);
    const [direction, setDirection] = useState(BattleshipDirection.Vertical);
    const [waiting, setWaiting] = useState(false);

    const shipyard = placements
        .filter(
            (p) =>
                p.battleship.status === BattleshipStatus.Default ||
                p.battleship.status === BattleshipStatus.Placeholder
        )
        .map((p) => p.battleship) as BattleshipAllyYard;

    const availableSquares = useMemo(() => {
        const selected = placements.find((p) => p.selected);
        if (!selected) return undefined;
        return getAvailableSquares(
            selected.battleship.length,
            direction,
            shipyard.filter((s) => s.status !== BattleshipStatus.Placeholder)
        );
    }, [placements, shipyard, direction]);

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

            return {
                battleship: {
                    ...p.battleship,
                    position,
                    direction,
                    status: BattleshipStatus.Placeholder,
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

    const onRandomize = async (_e: MouseEvent) => {
        const ships = await socketClient.randomize(4, 4, 30);
        const formattedShips = deserializePlacements(ships);

        const nextPlacements: PlacementList = formattedShips.map((fs) => ({
            battleship: fs,
            selected: false,
            status: PlacementStatus.Placed,
        }));

        setPlacements(nextPlacements);
    };

    const onReady = async (_e: MouseEvent) => {
        if (placements.find((p) => p.status !== PlacementStatus.Placed))
            throw new Error("Not all battleships are placed");

        const shipyard = placements.map((p) => p.battleship as BattleshipAlly);
        const serialized = serializePlacements(shipyard);
        const [hostReady, guestReady] = await socketClient.setup(serialized);

        if (hostReady && guestReady) return onSubmit(shipyard);

        setWaiting(true);
        await socketClient.waitReady();
        return onSubmit(shipyard);
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

    const onRotate = useCallback(() => {
        const index = placements.findIndex((p) => p.selected);
        setDirection((direction + 1) % 4);

        if (index === -1) return;

        const nextPlacements: PlacementList = placements.map((p, i) => {
            if (i !== index || p.status === PlacementStatus.Undecided)
                return p;
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
    }, [placements, direction]);

    useEffect(() => {
        const fn = (e: KeyboardEvent) => {
            if (e.code === "Space") {
                onRotate();
            }
        };

        document.addEventListener("keypress", fn);
        return () => document.removeEventListener("keypress", fn);
    }, [placements, direction, onRotate]);

    return (
        <Wrapper>
            <HeaderWrapper>
                <HeaderText>Plan your ship positions...</HeaderText>
                <RandomButton onClick={onRandomize}>
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
                        shipYard={shipyard}
                        availability={availableSquares}
                        onSquareHoverStart={onSquareHoverStart}
                        onSquareHoverEnd={onSquareHoverEnd}
                        onSquareClick={onSquareClick}
                    ></Board>
                    <MoreAction>
                        <RotateButton direction={direction} onClick={onRotate}><Left size="1.5rem" color="white"/></RotateButton>
                        <ResetButton onClick={onReset}>Reset</ResetButton>
                    </MoreAction>
                </BoardWrapper>
            </BodyWrapper>
            <Spacer />
            <ReadyButton onClick={onReady}>{waiting ? "Waiting for another player..." : "Ready!"}</ReadyButton>
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
    z-index: 99;
`;

const HeaderWrapper = styled.div`
    border-radius: 0.75rem;
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

const MoreAction = styled.div`
    display: flex; 
    flex-flow: row; 
    align-items: center;
    justify-content: center;
    gap: 1rem;
    width: 100%;
    margin-top: 1rem;
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
    width: auto;

    &:hover {
        transform: scaleX(1.04) scaleY(1.08);
    }

    &:active {
        transform: scaleX(0.96) scaleY(0.92);
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
    background: #ffdbb4;
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
    bottom: 0;
    flex-grow: 1; 

    &:hover {
        transform: scaleX(1.04) scaleY(1.08);
    }

    &:active {
        transform: scaleX(0.96) scaleY(0.92);
    }
`;

const RotateButton = styled(ResetButton)<{ direction: BattleshipDirection }>`
    padding: 0.5rem;
    flex-grow: 0;

    & > svg {
        transition: transform 200ms ease; 

        ${({ direction }) => {
            switch (direction) {
                case BattleshipDirection.Horizontal:
                    return css`
                        transform: rotate(0deg);
                    `;
                case BattleshipDirection.Vertical:
                    return css`
                        transform: rotate(90deg);
                    `;
                case BattleshipDirection.HorizontalRev:
                    return css`
                        transform: rotate(180deg);
                    `;
                case BattleshipDirection.VerticalRev:
                    return css`
                        transform: rotate(270deg);
                    `;
            }
        }}
    }
`;