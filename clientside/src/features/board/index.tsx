import styled from "styled-components";
import Square from "./components/Square";

const Board = () => {
    return (
        <Container>
            <Square />
        </Container>
    );
};

const Container = styled.div``;

export default Board;
