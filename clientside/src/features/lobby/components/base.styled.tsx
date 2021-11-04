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

export const Tag = styled.span`
    background: ${(props) =>
        props.theme.colors.lobby.button.background.secondary};
    border-radius: 0.375rem;
    padding: 0.125rem 0.375rem;
    margin: 0 0.375rem;

    font-weight: 500;
    font-size: 0.875rem;
    line-height: 1.125rem;

    color: ${(props) => props.theme.colors.lobby.button.text.secondary};

    cursor: pointer;
`;

export const Backdrop = styled.div`
    position: fixed;
    z-index: 5;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.6);
`;
