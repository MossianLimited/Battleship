import styled from "styled-components";
import { AvatarProperties, AvatarSide } from "../types/avatar";
import AvatarContainer from "./avatarContainer";

const AvatarVersus: React.FC<Partial<Record<AvatarSide, AvatarProperties>>> = ({
    left,
    right,
}) => {
    if ((left?.score && !right?.score) || (left?.score && !right?.score))
        throw new Error("Both players need scores");

    return (
        <Container
            isExpanded={left?.score !== undefined && right?.score !== undefined}
        >
            <AvatarContainer {...left} side={AvatarSide.Left} />
            {left?.seed && right?.seed && (
                <VS>
                    {left.score && <span className="score">{left.score}</span>}
                    <span className="vs-text">vs</span>
                    {left.score && <span className="score">{right.score}</span>}
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
    align-items: center;
    align-self: center;
    gap: 4.375rem;

    & > .vs-text {
        font-weight: 500;
        font-size: 3rem;
        line-height: 3.875rem;

        color: ${(props) => props.theme.colors.lobby.avatar.text.versus};
    }

    & > .score {
        font-weight: 500;
        font-size: 4.5rem;
        line-height: 5.875rem;

        color: ${(props) => props.theme.colors.lobby.avatar.text.score};
    }
`;

export default AvatarVersus;
