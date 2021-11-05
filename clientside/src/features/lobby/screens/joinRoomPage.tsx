import { useCallback, useEffect, useState } from "react";
import { useHistory } from "react-router";
import { Room } from "../../../api/types/transport";
import styled from "../../../styles/theme";
import AvatarVersus from "../../avatar/components/avatarVersus";
import useQuery from "../../routing/hooks/useQuery";
import { HeaderText, WhiteBox } from "../components/base.styled";
import BasicInput from "../components/basicInput";
import PublicRoomsList from "../components/publicRoomsList";
import { RoomContext } from "../contexts/roomContext";
import { useUserContext } from "../contexts/userContext";

const JoinRoomPage = () => {
    const { userAvatarSeed, username, isAdmin } = useUserContext();
    const history = useHistory();
    const query = useQuery();

    const [privateRoomId, setPrivateRoomId] = useState<string>(
        query.get("roomId") || ""
    );
    const [hoveredRoom, setHoveredRoom] = useState<Room | undefined>();

    const spectatorMode = query.get("spectator") === "true" && isAdmin;

    const handleJoinRoom = useCallback(
        (roomId: string) => {
            if (username && roomId)
                history.push({
                    pathname: "/room",
                    search: "?" + new URLSearchParams({ roomId }),
                });
            else
                history.push({
                    pathname: "/",
                    search: "?" + new URLSearchParams({ roomId }),
                });
        },
        [history, username]
    );

    useEffect(() => {
        if (privateRoomId.length === 6) handleJoinRoom(privateRoomId);
    }, [handleJoinRoom, privateRoomId]);

    return (
        <RoomContext.Provider value={{ hoveredRoom, setHoveredRoom }}>
            <Container>
                {!spectatorMode && (
                    <>
                        <AvatarVersus
                            right={{
                                seed: userAvatarSeed,
                                username,
                            }}
                            left={
                                hoveredRoom
                                    ? {
                                          seed: hoveredRoom.hostAvatar,
                                          username: hoveredRoom.hostUsername,
                                      }
                                    : undefined
                            }
                        />
                        <PrivateRoomContainer>
                            <Title>Join Private Room</Title>
                            <BasicInput
                                value={privateRoomId}
                                type="text"
                                maxLength={6}
                                onChange={(e) =>
                                    setPrivateRoomId(e.target.value)
                                }
                                placeholder="Enter a 6-digit room code"
                            />
                        </PrivateRoomContainer>
                    </>
                )}
                {spectatorMode && (
                    <AdminRoomContainer>
                        <Title>Admin Spectate Mode</Title>
                    </AdminRoomContainer>
                )}
            </Container>
            <PublicRoomsList onRoomJoinHandler={handleJoinRoom} />
        </RoomContext.Provider>
    );
};

const Container = styled(WhiteBox)`
    background: none;

    & > *:first-child {
        border-radius: 0.75rem 0.75rem 0 0;
    }
`;

const PrivateRoomContainer = styled.div`
    display: flex;
    flex-flow: column;
    padding: 1.625rem 2rem;

    background: ${(props) => props.theme.colors.lobby.backdrop.light};

    border-radius: 0 0 0.75rem 0.75rem;
`;

const AdminRoomContainer = styled(PrivateRoomContainer)`
    border-radius: 0.75rem !important;
    align-items: center;
    justify-content: center;

    padding: 1rem 2rem;

    & > * {
        margin-bottom: 0 !important;
    }
`;

const Title = styled(HeaderText)`
    margin-bottom: 1.1875rem;
`;

export default JoinRoomPage;
