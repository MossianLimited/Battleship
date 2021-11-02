import { useEffect, useRef, useState } from "react";
import { useHistory } from "react-router";
import socketClient from "../../../api/socketClient";
import styled from "../../../styles/theme";
import AvatarVersus from "../../avatar/components/avatarVersus";
import { HeaderText, WhiteBox } from "../components/base.styled";
import RoomModeSlider from "../components/roomModeSlider";
import { useUserContext } from "../contexts/userContext";
import { RoomMode } from "../types/utility";

const CreateRoomPage = () => {
    const { username, userAvatarSeed } = useUserContext();
    const history = useHistory();

    const roomComplete = useRef<boolean>(false);

    const [roomId, setRoomId] = useState<string>("");
    const [roomMode, setRoomMode] = useState<RoomMode>(RoomMode.Public);

    const handleRoomModeToggle = (mode: RoomMode) => {
        setRoomMode(mode);
        socketClient.changeLock();
    };

    useEffect(() => {
        const asyncCreateRoom = async () => {
            const createdRoomId = (await socketClient.createRoom(username))
                .roomID;
            setRoomId(createdRoomId);
        };

        asyncCreateRoom();

        return () => {
            if (!roomComplete.current) {
                socketClient.withdraw();
            }
        };
    }, [username]);

    useEffect(() => {
        if (roomId)
            socketClient.subscribeToRoomJoined(({ responseStatus }) => {
                switch (responseStatus) {
                    case "Completed":
                        roomComplete.current = true;
                        history.push({
                            pathname: "/room",
                            search:
                                "?" +
                                new URLSearchParams({
                                    roomId,
                                    isHost: "true",
                                }),
                        });
                        break;
                    default:
                        alert(responseStatus);
                }
            });
    }, [roomId, history]);

    return (
        <Container>
            <AvatarVersus
                leftAvatarSeed={userAvatarSeed}
                leftAvatarUsername={username}
            />
            <InfoBox>
                <HeadingBox>
                    <Title>Waiting for other player...</Title>
                    <RoomModeSlider
                        roomMode={roomMode}
                        onRoomModeToggleHandler={handleRoomModeToggle}
                    />
                </HeadingBox>
                <Guidelines>
                    <span>
                        Share the code below with the other player. Ask them to
                        click
                    </span>
                    <Tag>Join Room</Tag>
                    <span>and enter the code.</span>
                </Guidelines>
            </InfoBox>
            <GameCode>{(roomId && roomId.toUpperCase()) || " "}</GameCode>
        </Container>
    );
};

const Container = styled(WhiteBox)`
    background: none;

    & > *:first-child {
        margin-bottom: 1.6875rem;
    }
`;

const InfoBox = styled.div`
    display: flex;
    flex-flow: column;

    padding: 1.75rem 2rem 0;

    background: ${(props) => props.theme.colors.lobby.backdrop.light};

    border-radius: 0.75rem 0.75rem 0 0;
`;

const HeadingBox = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;

    margin-bottom: 1.3125rem;
`;

const Title = styled(HeaderText)`
    font-weight: 500;
    font-size: 1rem;
    line-height: 1.3125rem;
`;

const Guidelines = styled.p`
    margin: 0;
    margin-bottom: 1.375rem;
    padding: 0;

    font-weight: 500;
    font-size: 1rem;
    line-height: 1.75rem;

    user-select: none;

    color: ${(props) => props.theme.colors.lobby.info.guidelines};
`;

const Tag = styled.span`
    background: ${(props) =>
        props.theme.colors.lobby.button.background.secondary};
    border-radius: 0.375rem;
    padding: 0.125rem 0.375rem;
    margin: 0 0.375rem;

    font-weight: 500;
    font-size: 0.875rem;
    line-height: 1.125rem;

    color: ${(props) => props.theme.colors.lobby.button.text.secondary};

    cursor: pointer;
`;

const GameCode = styled.div`
    background: ${(props) => props.theme.colors.lobby.backdrop.shadedLight};

    font-weight: 700;
    font-size: 2.25rem;
    line-height: 2.9375rem;

    letter-spacing: 0.2em;

    color: ${(props) => props.theme.colors.lobby.info.heading};

    display: grid;
    place-items: center;
    padding: 1.375rem 0;

    border-radius: 0 0 0.75rem 0.75rem;
`;

export default CreateRoomPage;
