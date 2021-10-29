import { useEffect, useState } from "react";
import socketClient from "../../../api/socketClient";
import styled from "../../../styles/theme";
import { HeaderText, WhiteBox } from "../components/base.styled";
import BasicInput from "../components/basicInput";
import PublicRoomsList from "../components/publicRoomsList";
import { useUserContext } from "../contexts/userContext";

const JoinRoomPage = () => {
    const { username } = useUserContext();
    const [privateRoomId, setPrivateRoomId] = useState<string>("");

    useEffect(() => {
        if (privateRoomId.length === 6) {
            socketClient.joinRoom(username, privateRoomId);
            socketClient.subscribeToRoomJoined((msg, roomId) => {
                console.log(msg, roomId);
            });
        }
    }, [privateRoomId, username]);

    return (
        <>
            <Container>
                <Title>Join Private Room</Title>
                <BasicInput
                    value={privateRoomId}
                    type="text"
                    maxLength={6}
                    onChange={(e) => setPrivateRoomId(e.target.value)}
                    placeholder="Enter a 6-digit room code"
                />
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
