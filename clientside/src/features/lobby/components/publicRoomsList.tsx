import { useEffect, useState } from "react";
import socketClient from "../../../api/socketClient";
import { Room } from "../../../api/types/transport";
import styled from "../../../styles/theme";
import UserAvatar from "../../avatar/components/userAvatar";

const REFRESH_INTERVAL = 2000;

interface Props {
    onRoomJoinHandler: (roomID: string) => void;
}

const PublicRoomsList: React.FC<Props> = ({ onRoomJoinHandler }) => {
    const [roomList, setRoomList] = useState<Room[]>([]);

    useEffect(() => {
        let interval: ReturnType<typeof setInterval>;

        const asyncRefreshRoomList = async () => {
            // ping getRoomList every 2 seconds
            const fetchedRoomList = (await socketClient.getRoomList()).roomList;
            setRoomList(fetchedRoomList);
            interval = setInterval(async () => {
                const fetchedRoomList = (await socketClient.getRoomList())
                    .roomList;
                setRoomList(fetchedRoomList);
            }, REFRESH_INTERVAL);
        };

        asyncRefreshRoomList();

        return () => {
            clearInterval(interval);
        };
    }, []);

    const displayedRooms = roomList.map(({ roomID, hostUsername }) => (
        <SingleRoom key={roomID} onClick={() => onRoomJoinHandler(roomID)}>
            <div>
                <UserAvatar />
                <span>{hostUsername}</span>
            </div>
            <span>Join</span>
        </SingleRoom>
    ));

    return (
        <Container>
            <OverflowContainer>
                <RoomsContainer>{displayedRooms}</RoomsContainer>
            </OverflowContainer>
        </Container>
    );
};

const Container = styled.div`
    display: flex;
    flex-flow: column;

    margin: 2.25rem 0 1.0625rem;

    width: 28.6875rem;

    gap: 1.0625rem;

    & > * {
        font-weight: 500;
        font-size: 1rem;
        line-height: 1.3125rem;

        color: ${(props) => props.theme.colors.lobby.button.text.primary};
    }
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
    align-items: flex-end;

    background: ${(props) => props.theme.colors.lobby.button.background.room};
    color: ${(props) => props.theme.colors.lobby.button.text.room};

    /* padding: 0.875rem 1.9375rem; */
    height: 3.125rem;

    border-radius: 0.75rem;
    cursor: pointer;

    & > *:first-child {
        display: flex;
        align-items: center;
        align-items: flex-end;

        & > *:first-child {
            width: 2.5rem;
            height: 2.5rem;

            margin: 0 1rem 0 1.3125rem;
        }
        & > *:last-child {
            color: ${(props) => props.theme.colors.lobby.button.text.roomDark};
            height: 3.125rem;

            display: grid;
            place-items: center;
        }
    }

    & > *:last-child {
        width: 6rem;
        height: 100%;

        border-radius: 0 0.75rem 0.75rem 0;

        display: grid;
        place-items: center;
    }
`;

export default PublicRoomsList;
