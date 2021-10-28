import { FC } from "react";
import styled from "styled-components";
import Board from "../board";
import ShipPart from "../board/components/Ship";
import {
    BattleshipDirection,
    BattleshipPartType,
} from "../board/types/battleship";
import { Side } from "../board/types/utility";

const RefreshIcon: FC = () => {
    return (
        <RandomSvg
            width="25"
            height="25"
            viewBox="0 0 25 25"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M17.6596 6.4216C16.2085 4.97273 14.2178 4.07427 12.0078 4.07599C7.58782 4.07941 4.0206 7.66218 4.02403 12.0822C4.02746 16.5022 7.60023 20.0794 12.0202 20.076C15.7502 20.0731 18.8582 17.5207 19.7456 14.07L17.6656 14.0716C16.8474 16.4022 14.6287 18.074 12.0187 18.076C8.70868 18.0785 6.01659 15.3906 6.01403 12.0806C6.01146 8.77064 8.69937 6.07855 12.0094 6.07599C13.6694 6.0747 15.1499 6.76355 16.2307 7.85271L13.0132 11.0752L20.0132 11.0698L20.0078 4.06978L17.6596 6.4216Z"
                fill="#D0C9F0"
            />
        </RandomSvg>
    );
};

const Ship: FC = () => {
    return (
        <ShipWrapper>
            <ShipPart
                part={BattleshipPartType.Front}
                direction={BattleshipDirection.Vertical}
                translateFixed={false}
            ></ShipPart>
            <ShipPart
                part={BattleshipPartType.Middle}
                direction={BattleshipDirection.Vertical}
                translateFixed={false}
            ></ShipPart>
            <ShipPart
                part={BattleshipPartType.Middle}
                direction={BattleshipDirection.Vertical}
                translateFixed={false}
            ></ShipPart>
            <ShipPart
                part={BattleshipPartType.Back}
                direction={BattleshipDirection.Vertical}
                translateFixed={false}
            ></ShipPart>
        </ShipWrapper>
    );
};

const SetupModal: FC = (_) => {
    return (
        <Wrapper>
            <HeaderWrapper>
                <HeaderText>Plan your ship positions...</HeaderText>
                <RandomButton>
                    <RefreshIcon />
                    Random
                </RandomButton>
            </HeaderWrapper>
            <Spacer />
            <BodyWrapper>
                <ShipyardWrapper>
                    <ShipyardText>Shipyard</ShipyardText>
                    <Ship />
                    <Ship />
                    <Ship />
                    <Ship />
                </ShipyardWrapper>
                <BoardWrapper>
                    <Board selectable={false} boardType={Side.Ally} shipYard={[]}></Board>
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
    grid-template-rows: min-content 3rem minmax(0, 20rem) 2rem min-content;
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

const RandomSvg = styled.svg`
    margin-right: 0.375rem;
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
    padding-top: 0.125rem;
    align-items: center;
    align-content: center;
    width: 6rem;
    padding: 0.5rem 0; 
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

const BoardWrapper = styled.div``;

const ShipWrapper = styled.div`
    display: flex;
    flex-flow: column nowrap;
    height: min-content;
    margin: 0.375rem 1px 0;
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
