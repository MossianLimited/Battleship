import styled from "styled-components";

const Square: React.FC = () => {
    return <Container />;
};

const Container = styled.div`
    background: ${(props) => props.theme.colors.primary[100]};
    border: 0.125rem solid white;
    border-radius: 0.25rem;

    width: 2rem;
    height: 2rem;
`;

export default Square;
