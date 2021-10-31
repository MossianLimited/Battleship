import { FC } from 'react'; 
import styled from 'styled-components';

const RefreshIcon: FC = () => {
    return (
        <RandomSvg
            width="25"
            height="25"
            viewBox="0 0 25 25"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M17.6596 6.4216C16.2085 4.97273 14.2178 4.07427 12.0078 4.07599C7.58782 4.07941 4.0206 7.66218 4.02403 12.0822C4.02746 16.5022 7.60023 20.0794 12.0202 20.076C15.7502 20.0731 18.8582 17.5207 19.7456 14.07L17.6656 14.0716C16.8474 16.4022 14.6287 18.074 12.0187 18.076C8.70868 18.0785 6.01659 15.3906 6.01403 12.0806C6.01146 8.77064 8.69937 6.07855 12.0094 6.07599C13.6694 6.0747 15.1499 6.76355 16.2307 7.85271L13.0132 11.0752L20.0132 11.0698L20.0078 4.06978L17.6596 6.4216Z"
                fill="#D0C9F0"
            />
        </RandomSvg>
    );
};

export default RefreshIcon; 

const RandomSvg = styled.svg`
    margin-right: 0.375rem;
`;