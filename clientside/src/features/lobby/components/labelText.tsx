import React from "react";
import styled from "../../../styles/theme";

const LabelText: React.FC = ({ children }) => {
    return <StyledParagraph>{children}</StyledParagraph>;
};

const StyledParagraph = styled.label`
    margin: 0;
    padding: 0;

    font-weight: 400;
    font-size: 0.875rem;
    line-height: 1.125rem;

    color: ${(props) => props.theme.colors.lobby.info.label};
`;

export default LabelText;
