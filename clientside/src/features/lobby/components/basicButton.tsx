import { ButtonHTMLAttributes } from "react";
import styled from "../../../styles/theme";

type ButtonVariant = "primary" | "secondary";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
}

const BasicButton: React.FC<Props> = ({
    variant = "primary",
    children,
    ...delegated
}) => {
    return (
        <StyledButton variant={variant} {...delegated}>
            {children}
        </StyledButton>
    );
};

const StyledButton = styled.button<{ variant: ButtonVariant }>`
    background: ${(props) =>
        props.theme.colors.lobby.button.background[props.variant]};
    border-radius: 0.375rem;

    height: 3.25rem;

    color: ${(props) => props.theme.colors.lobby.button.text[props.variant]};

    font-family: DM Sans;
    font-weight: ${(props) => (props.variant === "primary" ? 700 : 500)};
    font-size: 1rem;
    line-height: 1.3125rem;

    cursor: pointer;

    transition: scale 100ms ease-in-out;
    &:hover {
        transition: scale 100ms ease-in-out;
        scale: 1.025;
    }
`;

export default BasicButton;
