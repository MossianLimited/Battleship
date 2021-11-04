import styled from "styled-components";
import moment from 'moment';
import { FC } from "react";
import { StatResponse } from "../../api/types/transport";
import Win from "./components/win";
import Lose from "./components/lose";

interface Props {
    winners: ("Host" | "Guest")[];
    stats: StatResponse[];
}

const Result: FC<Props> = ({ stats, winners }) => {
    return (
        <Wrapper>
            {stats.map((st, index) => {
                const winner = winners[index];
                const timestamp = moment(st.time).format("m:ss");
                return (
                    <Row key={index}>
                        <LeftStats>
                            {st.host.hit}/{st.host.total}/{st.host.acc.toFixed(0)}%
                        </LeftStats>
                        <RoundInfo>
                            {winner === "Host" ? (
                                <Win size={25} />
                            ) : (
                                <Lose size={25} />
                            )}
                            <RoundTime>
                                {timestamp} ({st.turnCount})
                            </RoundTime>
                            {winner === "Guest" ? (
                                <Win size={25} />
                            ) : (
                                <Lose size={25} />
                            )}
                        </RoundInfo>
                        <RightStats>
                            {st.guest.hit}/{st.guest.total}/{st.guest.acc.toFixed(0)}%
                        </RightStats>
                    </Row>
                );
            })}
        </Wrapper>
    );
};

export default Result;

const Wrapper = styled.div`
    display: flex;
    flex-flow: column;
    max-height: 15rem; 
    height: min-content; 
    min-width: 38.9375rem;
    background: white;
    border-radius: 0 0 0.75rem 0.75rem;
    overflow: auto; 
`;

const Row = styled.div`
    width: 100%;
    background: white;
    min-height: 3rem; 
    height: 3rem; 
    position: relative; 
    display: flex; 
    flex-flow: row; 
    align-items: center; 
    justify-content: center;

    &:nth-child(even) {
        background: #f3f1ff;
    }
`;

const LeftStats = styled.span`
    font-size: 1rem;
    color: #b1a5ec;
    position: absolute; 
    left: 3.125rem; 
`;

const RightStats = styled(LeftStats)`
    right: 3.125rem; 
    left: auto; 
`;


const RoundInfo = styled.span`
    display: flex; 
    flex-flow: row; 
    align-items: center;
    justify-content: space-between;
    width: 13.5rem; 
`;

const RoundTime = styled.span`
    color: #584f86;
    font-size: 1rem;
    font-weight: 500; 
`;