import { useEffect, useState } from "react";
import socketClient from "../../../api/socketClient";
import styled from "../../../styles/theme";
import { HeaderText, WhiteBox } from "../components/base.styled";
import RoomModeSlider from "../components/roomModeSlider";
import { useUserContext } from "../contexts/userContext";

const CreateRoomPage = () => {
    const { username } = useUserContext();
    const [roomId, setRoomId] = useState<string>("");

    useEffect(() => {
        socketClient.createRoom(username);
        socketClient.subscribeToRoomCreated((roomId) => {
            setRoomId(roomId);
        });
    }, [username]);

    return (
        <Container>
            <InfoBox>
                <HeadingBox>
                    <Title>Waiting for other player...</Title>
                    <RoomModeSlider onClickHandler={() => null} />
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
            <GameCode>{roomId && roomId.toUpperCase()}</GameCode>
        </Container>
    );
};

const Container = styled(WhiteBox)``;

const InfoBox = styled.div`
    display: flex;
    flex-flow: column;

    padding: 1.75rem 2rem 0;
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
`;

export default CreateRoomPage;
