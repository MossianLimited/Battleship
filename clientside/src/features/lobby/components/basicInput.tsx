import { motion, MotionProps } from "framer-motion";
import { InputHTMLAttributes } from "react";
import styled from "../../../styles/theme";

const BasicInput: React.FC<
    InputHTMLAttributes<HTMLInputElement> & MotionProps
> = ({ ...delegated }) => {
    return <StyledInput {...delegated} />;
};

const StyledInput = styled(motion.input)`
    background: ${(props) => props.theme.colors.lobby.input.background.light};
    border-radius: 0.375rem;

    width: 100%;
    height: 3.5rem;

    font-weight: 400;
    font-size: 1rem;
    line-height: 1.3125rem;

    padding-left: 1.375rem;

    color: black;

    &::placeholder {
        color: ${(props) => props.theme.colors.lobby.input.text.placeholder};
    }
`;

export default BasicInput;
