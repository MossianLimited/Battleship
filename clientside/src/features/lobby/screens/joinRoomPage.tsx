import { useCallback, useEffect, useState } from "react";
import { useHistory } from "react-router";
import styled from "../../../styles/theme";
import AvatarVersus from "../../avatar/components/avatarVersus";
import { HeaderText, WhiteBox } from "../components/base.styled";
import BasicInput from "../components/basicInput";
import PublicRoomsList from "../components/publicRoomsList";
import { useUserContext } from "../contexts/userContext";

const JoinRoomPage = () => {
    const { userAvatarSeed, username } = useUserContext();
    const history = useHistory();

    const [privateRoomId, setPrivateRoomId] = useState<string>("");

    const handleJoinRoom = useCallback(
        (roomId: string) => {
            history.push({
                pathname: "/room",
                search: "?" + new URLSearchParams({ roomId }),
            });
        },
        [history]
    );

    useEffect(() => {
        if (privateRoomId.length === 6) handleJoinRoom(privateRoomId);
    }, [handleJoinRoom, privateRoomId]);

    return (
        <>
            <Container>
                <AvatarVersus
                    rightAvatarSeed={userAvatarSeed}
                    rightAvatarUsername={username}
                />
                <PrivateRoomContainer>
                    <Title>Join Private Room</Title>
                    <BasicInput
                        value={privateRoomId}
                        type="text"
                        maxLength={6}
                        onChange={(e) => setPrivateRoomId(e.target.value)}
                        placeholder="Enter a 6-digit room code"
                    />
                </PrivateRoomContainer>
            </Container>
            <PublicRoomsList onRoomJoinHandler={handleJoinRoom} />
        </>
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

const Title = styled(HeaderText)`
    margin-bottom: 1.1875rem;
`;

export default JoinRoomPage;
