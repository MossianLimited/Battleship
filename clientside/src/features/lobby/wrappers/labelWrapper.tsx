import React from "react";
import styled from "../../../styles/theme";
import { LabelText } from "../components/base.styled";

const LabelWrapper: React.FC<{ label: string }> = ({ label, children }) => {
    return (
        <Container>
            <LabelText>{label}</LabelText>
            {children}
        </Container>
    );
};

const Container = styled.div`
    display: flex;
    flex-flow: column;

    gap: 0.4375rem;
`;

export default LabelWrapper;
