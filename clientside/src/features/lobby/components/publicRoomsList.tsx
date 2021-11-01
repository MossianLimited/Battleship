import { useEffect, useState } from "react";
// import { useHistory } from "react-router";
import socketClient from "../../../api/socketClient";
import { Room } from "../../../api/types/transport";
import styled from "../../../styles/theme";
import { HeaderText } from "./base.styled";

const REFRESH_INTERVAL = 2000;

const PublicRoomsList = () => {
    const [roomList, setRoomList] = useState<Room[]>([]);
    //    const history = useHistory();

    useEffect(() => {
        // ping getRoomList every 2 seconds
        socketClient.getRoomList();
        const interval = setInterval(() => {
            socketClient.getRoomList();
        }, REFRESH_INTERVAL);

        socketClient.subscribeToRoomList(({ roomList: fetchedRoomList }) => {
            setRoomList(fetchedRoomList);
        });

        return () => {
            clearInterval(interval);
        };
    }, []);

    const displayedRooms = roomList.map(({ roomID, hostUsername }) => (
        <SingleRoom
            key={roomID}
            onClick={() => alert("Joining room " + roomID)}
        >
            <span>{hostUsername}</span>
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
