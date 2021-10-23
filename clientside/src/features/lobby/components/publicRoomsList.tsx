import styled from "../../../styles/theme";
import { HeaderText } from "./base.styled";

const MOCK_ROOM_NAMES = [
    "Winnaries",
    "Wasurocks",
    "Mossdinger",
    "Boss WT",
    "Adam",
    "Brian",
];

const PublicRoomsList = () => {
    const displayedRooms = MOCK_ROOM_NAMES.map((roomName) => (
        <SingleRoom key={roomName}>
            <span>{roomName}</span>
            <span>Join</span>
        </SingleRoom>
    ));

    return (
        <Container>
            <Title>Join Public Room</Title>
            <OverflowContainer>
                <RoomsContainer>{displayedRooms}</RoomsContainer>
            </OverflowContainer>
        </Container>
    );
};

const Container = styled.div`
    display: flex;
    flex-flow: column;

    margin: 2.9375rem 0 1.0625rem;
    width: 28.6875rem;

    gap: 1.0625rem;

    & > * {
        font-weight: 500;
        font-size: 1rem;
        line-height: 1.3125rem;

        color: ${(props) => props.theme.colors.lobby.button.text.primary};
    }
`;

const Title = styled(HeaderText)`
    padding: 0 1.9375rem;
`;

const OverflowContainer = styled.div`
    overflow-y: auto;
    height: 14.375rem;
`;

const RoomsContainer = styled.div`
    display: flex;
    flex-flow: column;
    gap: 0.625rem;
`;

const SingleRoom = styled.div`
    display: flex;
    justify-content: space-between;
    background: ${(props) => props.theme.colors.lobby.button.background.room};
    padding: 0.875rem 1.9375rem;
    border-radius: 0.375rem;
    cursor: pointer;
`;

export default PublicRoomsList;
