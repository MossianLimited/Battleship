import styled from "../../../styles/theme";
import { HeaderText, WhiteBox } from "../components/base.styled";
import BasicInput from "../components/basicInput";
import PublicRoomsList from "../components/publicRoomsList";

const JoinRoomPage = () => {
    return (
        <>
            <Container>
                <Title>Join Private Room</Title>
                <BasicInput placeholder="Enter a 6-digit room code" />
            </Container>
            <PublicRoomsList />
        </>
    );
};

const Container = styled(WhiteBox)`
    padding: 1.625rem 2rem;
`;

const Title = styled(HeaderText)`
    margin-bottom: 1.1875rem;
`;

export default JoinRoomPage;
