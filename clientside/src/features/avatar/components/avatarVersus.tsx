import styled from "styled-components";
import { Side } from "../../board/types/utility";
import { AvatarProperties, AvatarSide } from "../types/avatar";
import AvatarContainer from "./avatarContainer";

const AvatarVersus: React.FC<
    Partial<Record<AvatarSide, AvatarProperties>> & { style?: any; side?: Side }
> = ({ left, right, ...delegated }) => {
    const hasLeftScore = typeof left?.score !== "undefined";
    const hasRightScore = typeof right?.score !== "undefined";

    if ((hasLeftScore && !hasRightScore) || (!hasLeftScore && hasRightScore))
        throw new Error("Both players need scores");

    return (
        <Container isExpanded={hasLeftScore && hasRightScore !== undefined} {...delegated}>
            <AvatarContainer {...left} side={AvatarSide.Left} />
            {left?.seed && right?.seed && (
                <VS>
                    {hasLeftScore && (
                        <span className="score-left">{left.score}</span>
                    )}
                    <span className="vs-text">vs</span>
                    {hasRightScore && (
                        <span className="score-right">{right.score}</span>
                    )}
                </VS>
            )}
            <AvatarContainer {...right} side={AvatarSide.Right} />
        </Container>
    );
};

const Container = styled.div<{ isExpanded?: boolean }>`
    padding: 0 2.5625rem;

    border-radius: 0.75rem;

    height: 8.125rem;
    min-width: ${(props) => (props.isExpanded ? "38.9375rem" : "100%")};
    background: ${(props) => props.theme.colors.lobby.avatar.background.light};

    display: flex;
    align-items: flex-end;
    justify-content: space-between;
`;

const VS = styled.div`
    display: flex;
    flex-flow: row;
    align-items: center;
    align-self: center;
    justify-content: center;
    gap: 2.75rem;
    position: relative;
    width: 10rem;
    transform: translateY(0.25rem);

    & > .vs-text {
        font-weight: 500;
        font-size: 3rem;
        line-height: 3.875rem;

        color: ${(props) => props.theme.colors.lobby.avatar.text.versus};
    }

    & > .score-left {
        font-weight: 500;
        font-size: 4.5rem;
        line-height: 5.875rem;
        position: absolute;
        transform-origin: center center;
        transform: translateX(-6rem);

        color: ${(props) => props.theme.colors.lobby.avatar.text.score};
    }

    & > .score-right {
        font-weight: 500;
        font-size: 4.5rem;
        line-height: 5.875rem;
        position: absolute;
        transform-origin: center center;
        transform: translateX(6rem);

        color: ${(props) => props.theme.colors.lobby.avatar.text.score};
    }
`;

export default AvatarVersus;
