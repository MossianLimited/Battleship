import { useCallback, useEffect, useState } from "react";
import { useHistory } from "react-router";
import styled from "../../../styles/theme";
import { HeaderText, WhiteBox } from "../components/base.styled";
import BasicInput from "../components/basicInput";
import PublicRoomsList from "../components/publicRoomsList";

const JoinRoomPage = () => {
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
                <Title>Join Private Room</Title>
                <BasicInput
                    value={privateRoomId}
                    type="text"
                    maxLength={6}
                    onChange={(e) => setPrivateRoomId(e.target.value)}
                    placeholder="Enter a 6-digit room code"
                />
            </Container>
            <PublicRoomsList onRoomJoinHandler={handleJoinRoom} />
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
