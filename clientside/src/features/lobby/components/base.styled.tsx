import styled from "../../../styles/theme";

export const LabelText = styled.label`
    margin: 0;
    padding: 0;

    font-weight: 400;
    font-size: 0.875rem;
    line-height: 1.125rem;

    color: ${(props) => props.theme.colors.lobby.info.label};
`;

export const HeaderText = styled.h1`
    margin: 0;
    padding: 0;

    font-weight: 500;
    font-size: 1rem;
    line-height: 1.3125rem;

    user-select: none;

    color: ${(props) => props.theme.colors.lobby.info.heading};
`;

export const WhiteBox = styled.div`
    background: ${(props) => props.theme.colors.lobby.backdrop.light};
    border-radius: 0.75rem;

    width: 28.6875rem;

    display: flex;
    flex-flow: column;
`;
