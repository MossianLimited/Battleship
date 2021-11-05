import { AnimatePresence, motion, Variants } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import { useHistory } from "react-router";
import socketClient from "../../../api/socketClient";
import { AdminSpectateRoom, Room } from "../../../api/types/transport";
import styled from "../../../styles/theme";
import UserAvatar from "../../avatar/components/userAvatar";
import useQuery from "../../routing/hooks/useQuery";
import { useRoomContext } from "../contexts/roomContext";
import { useUserContext } from "../contexts/userContext";

// ping getRooms every 1 second
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
    const { isAdmin } = useUserContext();

    const query = useQuery();
    const spectatorMode = query.get("spectator") === "true" && isAdmin;

    const [roomList, setRoomList] = useState<(Room | AdminSpectateRoom)[]>([]);
    const [allowOverflowY, setOverflowY] = useState<boolean>(false);

    const handleFetchRoomList = useCallback(async () => {
        let fetchedRoomList: (Room | AdminSpectateRoom)[] = [];
        if (spectatorMode) {
            const { roomList: adminFetchedRoomList } =
                await socketClient.adminGetRooms();
            fetchedRoomList = adminFetchedRoomList;
        } else {
            fetchedRoomList = (await socketClient.getRooms()).roomList;
        }
        setRoomList(fetchedRoomList);
    }, [spectatorMode]);

    useEffect(() => {
        let interval: ReturnType<typeof setInterval>;

        const asyncRefreshRoomList = async () => {
            handleFetchRoomList();
            interval = setInterval(async () => {
                handleFetchRoomList();
            }, REFRESH_INTERVAL);
        };

        asyncRefreshRoomList();

        return () => {
            clearInterval(interval);
        };
    }, [handleFetchRoomList]);

    const displayedRooms = roomList.map((room) => {
        const { roomID, hostAvatar, hostUsername } = room;
        return (
            <SingleRoom
                key={roomID}
                onClick={() => !spectatorMode && onRoomJoinHandler(roomID)}
                onHoverStart={() => setHoveredRoom(room)}
                onHoverEnd={() => setHoveredRoom(undefined)}
                variants={listItem}
                exit={{ opacity: 0, transition: { duration: 0.2 } }}
            >
                <div>
                    <div className="avatarContainer">
                        <UserAvatar seed={hostAvatar} variant="none" />
                        {spectatorMode &&
                            (room as AdminSpectateRoom).guestUsername && (
                                <UserAvatar
                                    seed={
                                        (room as AdminSpectateRoom).guestAvatar
                                    }
                                    variant="none"
                                />
                            )}
                    </div>
                    <span
                        style={
                            spectatorMode
                                ? { marginLeft: "1.3125rem" }
                                : undefined
                        }
                        className="username"
                    >
                        {hostUsername}
                        {spectatorMode &&
                        (room as AdminSpectateRoom).guestUsername
                            ? " vs " + (room as AdminSpectateRoom).guestUsername
                            : ""}
                    </span>
                </div>
                <span>{spectatorMode ? "" : "Join"}</span>
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
        align-items: flex-end;

        & > .avatarContainer {
            display: flex;
            margin: 0 1rem 0 1.3125rem;
            position: relative;

            & > * {
                width: 2.5rem;
                height: 2.5rem;

                &:nth-child(2) {
                    position: absolute;
                    transform: translateX(1.5rem);
                }
            }
        }
        & > .username {
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
