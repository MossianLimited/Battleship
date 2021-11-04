import { motion } from "framer-motion";
import styled from "styled-components";

const ArrowIcon: React.FC<{
    onClickHandler?: () => void;
    direction?: "left" | "right";
}> = ({ onClickHandler, direction = "left" }) => {
    const isRotated = direction === "left";

    return (
        <Container
            onClick={() => onClickHandler && onClickHandler()}
            initial={{ rotate: isRotated ? 180 : 0 }}
            whileHover={{ rotate: isRotated ? 180 : 0, scale: 1.1 }}
        >
            <motion.svg
                width="1.8125rem"
                height="1.75rem"
                viewBox="0 0 29 28"
                xmlns="http://www.w3.org/2000/svg"
            >
                <motion.path
                    d="M11.9062 2.18115L13.2937 0.793652C13.8812 0.206152 14.8313 0.206152 15.4125 0.793652L27.5625 12.9374C28.15 13.5249 28.15 14.4749 27.5625 15.0562L15.4125 27.2062C14.825 27.7937 13.875 27.7937 13.2937 27.2062L11.9062 25.8187C11.3125 25.2249 11.325 24.2562 11.9312 23.6749L19.4625 16.4999H1.5C0.66875 16.4999 0 15.8312 0 14.9999V12.9999C0 12.1687 0.66875 11.4999 1.5 11.4999H19.4625L11.9312 4.3249C11.3187 3.74365 11.3062 2.7749 11.9062 2.18115Z"
                    fill="#C2B6FF"
                />
            </motion.svg>
        </Container>
    );
};

const Container = styled(motion.div)`
    width: 2.4rem;
    height: 2.4rem;
    background: rgba(0, 0, 0, 0.2);

    display: grid;
    place-items: center;

    border-radius: 50%;

    cursor: pointer;
`;

export default ArrowIcon;
