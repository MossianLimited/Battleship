import { useState } from "react";
import styled from "styled-components";
import { useTheme } from "../../../styles/theme";
import { Backdrop } from "../../lobby/components/base.styled";
import BasicButton from "../../lobby/components/basicButton";
import TutorialModal from "../../tutorial/components/tutorialModal";

const TutorialWrapper: React.FC = ({ children }) => {
    const theme = useTheme();
    const [tutorialModalShown, setTutorialModalShown] =
        useState<boolean>(false);

    return (
        <>
            {children}
            <TutorialButton onClick={() => setTutorialModalShown(true)}>
                <svg
                    width="0.6875rem"
                    height="1.5625rem"
                    viewBox="0 0 11 25"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M1.78906 20.7143H2.76562V13.6607H1.78906C1.24971 13.6607 0.8125 13.2235 0.8125 12.6841V10.3516C0.8125 9.81221 1.24971 9.375 1.78906 9.375H7.25781C7.79717 9.375 8.23438 9.81221 8.23438 10.3516V20.7143H9.21094C9.75029 20.7143 10.1875 21.1515 10.1875 21.6909V24.0234C10.1875 24.5628 9.75029 25 9.21094 25H1.78906C1.24971 25 0.8125 24.5628 0.8125 24.0234V21.6909C0.8125 21.1515 1.24971 20.7143 1.78906 20.7143ZM5.5 0C3.55835 0 1.98438 1.57397 1.98438 3.51562C1.98438 5.45728 3.55835 7.03125 5.5 7.03125C7.44165 7.03125 9.01562 5.45728 9.01562 3.51562C9.01562 1.57397 7.4416 0 5.5 0Z"
                        fill={theme.colors.tutorial.infoButton.text}
                    />
                </svg>
            </TutorialButton>
            {tutorialModalShown && (
                <>
                    <StyledBackdrop
                        onClick={() => setTutorialModalShown(false)}
                    />
                    <TutorialModal
                        onCloseHandler={() => setTutorialModalShown(false)}
                    />
                </>
            )}
        </>
    );
};

const TutorialButton = styled(BasicButton)`
    position: absolute;

    bottom: 1.625rem;
    right: 1.625rem;
    width: 3rem;
    height: 3rem;
    border-radius: 50%;

    display: grid;
    place-items: center;

    background: ${(props) => props.theme.colors.tutorial.infoButton.background};

    &:hover {
        transform: scale(1.1);
    }
`;

const StyledBackdrop = styled(Backdrop)`
    z-index: 4;
`;

export default TutorialWrapper;
