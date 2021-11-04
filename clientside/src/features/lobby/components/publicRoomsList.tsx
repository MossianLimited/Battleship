import { AnimatePresence, motion, Variants } from "framer-motion";
import { useEffect, useState } from "react";
import socketClient from "../../../api/socketClient";
import { Room } from "../../../api/types/transport";
import styled from "../../../styles/theme";
import UserAvatar from "../../avatar/components/userAvatar";
import { useRoomContext } from "../contexts/roomContext";

const REFRESH_INTERVAL = 1000;

const container: Variants = {
    hidden: { height: 0 },
    show: {
        height: "14.375rem",
        transition: {
            delay: 0.2,
            staggerChildren: 0.25,
            duration: 0.25,
        },
    },
};

const listItem: Variants = {
    hidden: { y: -5, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { duration: 0.2 } },
};

interface Props {
    onRoomJoinHandler: (roomID: string) => void;
}

const PublicRoomsList: React.FC<Props> = ({ onRoomJoinHandler }) => {
    const { setHoveredRoom } = useRoomContext();

    const [roomList, setRoomList] = useState<Room[]>([]);
    const [allowOverflowY, setOverflowY] = useState<boolean>(false);

    useEffect(() => {
        let interval: ReturnType<typeof setInterval>;

        const asyncRefreshRoomList = async () => {
            // ping getRooms every 2 seconds
            const fetchedRoomList = (await socketClient.getRooms()).roomList;
            setRoomList(fetchedRoomList);
            interval = setInterval(async () => {
                const fetchedRoomList = (await socketClient.getRooms())
                    .roomList;
                setRoomList(fetchedRoomList);
            }, REFRESH_INTERVAL);
        };

        asyncRefreshRoomList();

        return () => {
            clearInterval(interval);
        };
    }, []);

    const displayedRooms = roomList.map((room) => {
        const { roomID, hostAvatar, hostUsername } = room;
        return (
            <SingleRoom
                key={roomID}
                onClick={() => onRoomJoinHandler(roomID)}
                onHoverStart={() => setHoveredRoom(room)}
                onHoverEnd={() => setHoveredRoom(undefined)}
                variants={listItem}
                exit={{ opacity: 0, transition: { duration: 0.2 } }}
            >
                <div>
                    <UserAvatar seed={hostAvatar} variant="none" />
                    <span>{hostUsername}</span>
                </div>
                <span>Join</span>
            </SingleRoom>
        );
    });

    return (
        <Container>
            <AnimatePresence>
                {roomList.length > 0 && (
                    <OverflowContainer
                        initial="hidden"
                        animate="show"
                        exit="hidden"
                        variants={container}
                        onAnimationStart={() => setOverflowY(false)}
                        onAnimationComplete={() => setOverflowY(true)}
                        style={{
                            overflowY: allowOverflowY ? "auto" : "hidden",
                        }}
                    >
                        <AnimatePresence>{displayedRooms}</AnimatePresence>
                    </OverflowContainer>
                )}
            </AnimatePresence>
        </Container>
    );
};

const Container = styled(motion.div)`
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

const OverflowContainer = styled(motion.div)`
    overflow-x: hidden;
`;

// const RoomsContainer = styled(motion.div)`
//     display: flex;
//     flex-flow: column;
//     gap: 0.625rem;
// `;

const SingleRoom = styled(motion.div)`
    display: flex;
    justify-content: space-between;
    align-items: flex-end;

    margin-bottom: 0.625rem;

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
