import { motion } from "framer-motion";
import { useState } from "react";
import styled from "../../../styles/theme";
import { TUTORIAL_INFO_LIST } from "../constants/tutorial";
import ArrowIcon from "./arrowIcon";

const TutorialModal: React.FC<{ onCloseHandler: () => void }> = ({
    onCloseHandler,
}) => {
    const [pageNumber, setPageNumber] = useState<number>(0);
    const { imgSrc, imgAlt, text } = TUTORIAL_INFO_LIST[pageNumber];

    return (
        <Container>
            <Header>
                <span>Tutorial</span>
                <span>
                    {pageNumber + 1}/{TUTORIAL_INFO_LIST.length}
                </span>
                <motion.svg
                    viewBox="0 0 25 25"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    onClick={() => onCloseHandler()}
                    initial="default"
                    whileHover="hover"
                >
                    <motion.path
                        d="M15.7578 12.5L20.644 7.61377C21.2437 7.01416 21.2437 6.04199 20.644 5.44189L19.5581 4.35596C18.9585 3.75635 17.9863 3.75635 17.3862 4.35596L12.5 9.24219L7.61377 4.35596C7.01416 3.75635 6.04199 3.75635 5.44189 4.35596L4.35596 5.44189C3.75635 6.0415 3.75635 7.01367 4.35596 7.61377L9.24219 12.5L4.35596 17.3862C3.75635 17.9858 3.75635 18.958 4.35596 19.5581L5.44189 20.644C6.0415 21.2437 7.01416 21.2437 7.61377 20.644L12.5 15.7578L17.3862 20.644C17.9858 21.2437 18.9585 21.2437 19.5581 20.644L20.644 19.5581C21.2437 18.9585 21.2437 17.9863 20.644 17.3862L15.7578 12.5Z"
                        variants={{
                            default: {
                                fill: "#C2B6FF",
                            },
                            hover: {
                                fill: "red",
                            },
                        }}
                    />
                </motion.svg>
            </Header>
            <Content>
                <img src={imgSrc} alt={imgAlt} />
                <BackdropGradient />
                <Instructions>{text}</Instructions>
                <ArrowContainer>
                    {pageNumber - 1 >= 0 ? (
                        <ArrowIcon
                            direction="left"
                            onClickHandler={() => setPageNumber(pageNumber - 1)}
                        />
                    ) : (
                        <div />
                    )}
                    {pageNumber + 1 < TUTORIAL_INFO_LIST.length ? (
                        <ArrowIcon
                            direction="right"
                            onClickHandler={() => setPageNumber(pageNumber + 1)}
                        />
                    ) : (
                        <div />
                    )}
                </ArrowContainer>
            </Content>
        </Container>
    );
};

const Container = styled.div`
    z-index: 4;
    position: absolute;
    background: ${(props) =>
        props.theme.colors.tutorial.modal.background.primary};

    width: 37.875rem;
    height: 25.125rem;

    border-radius: 0.75rem;
`;

const Header = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;

    position: relative;

    padding: 0 1.125rem 0 1.8125rem;

    width: 100%;
    height: 3.625rem;

    border-radius: 0.75rem 0.75rem 0 0;

    background: ${(props) =>
        props.theme.colors.tutorial.modal.background.light};

    & > * {
        font-weight: 700;
        font-size: 1.25rem;
        line-height: 1.625rem;

        display: flex;
        align-items: center;
        letter-spacing: 0.05em;

        &:first-child {
            color: #160668;
        }

        &:nth-child(2) {
            color: #674def;
            position: absolute;
            left: 50%;
            transform: translateX(-50%);
        }

        &:last-child {
            width: 1.5625rem;
            height: 1.5625rem;

            cursor: pointer;
        }
    }
`;

const Content = styled.div`
    height: calc(100% - 3.625rem);

    position: relative;

    display: flex;
    flex-flow: column;

    overflow: hidden;

    border-radius: 0 0 0.75rem 0.75rem;

    & > *:first-child {
        height: 100%;
        width: 100%;
        object-fit: cover;
    }
`;

const Instructions = styled.p`
    padding: 0;
    margin: 0;

    position: absolute;
    z-index: 2;
    left: 2.25rem;
    bottom: 1.25rem;

    width: 26.9375rem;

    font-weight: 700;
    font-size: 1.25rem;
    line-height: 1.625rem;

    display: flex;
    align-items: center;
    letter-spacing: 0.05em;

    color: #ffffff;
`;

const BackdropGradient = styled.div`
    position: absolute;
    bottom: 0;
    z-index: 1;

    width: 100%;
    height: 10rem;
    background: linear-gradient(
        360deg,
        rgba(0, 0, 0, 0.7) 1.4%,
        rgba(0, 0, 0, 0) 98.46%
    );
`;

const ArrowContainer = styled.div`
    position: absolute;
    height: 100%;
    width: 100%;

    display: flex;
    align-items: center;
    justify-content: space-between;

    padding: 0 1.125rem;
`;

export default TutorialModal;
