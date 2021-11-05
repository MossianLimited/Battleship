import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useHistory } from "react-router";
import socketClient from "../../../api/socketClient";
import styled from "../../../styles/theme";
import AvatarVersus from "../../avatar/components/avatarVersus";
import { useOnJoinSingle } from "../../game/functions/useOnJoin";
import { HeaderText, Tag, WhiteBox } from "../components/base.styled";
import RoomModeSlider from "../components/roomModeSlider";
import { useUserContext } from "../contexts/userContext";
import { RoomMode } from "../types/utility";

const CreateRoomPage = () => {
    const { username, userAvatarSeed } = useUserContext();
    const history = useHistory();

    const roomComplete = useRef<boolean>(false);

    const [roomId, setRoomId] = useState<string>("");
    const [roomMode, setRoomMode] = useState<RoomMode>(RoomMode.Public);
    const [linkCopied, setLinkCopied] = useState<boolean>(false);

    const handleRoomModeToggle = (mode: RoomMode) => {
        setRoomMode(mode);
        socketClient.toggleLock();
    };

    const handleCopyLink = () => {
        if (!roomId) return;

        const link =
            window.location.href.split("/").slice(0, -1).join("/") +
            "/rooms?roomId=" +
            roomId;
        navigator.clipboard.writeText(link);
        if (!linkCopied) {
            setLinkCopied(true);
            setTimeout(() => {
                setLinkCopied(false);
            }, 1000);
        }
    };

    useEffect(() => {
        const asyncCreateRoom = async () => {
            const createdRoomId = (await socketClient.createRoom(username))
                .roomID;
            setRoomId(createdRoomId);
            socketClient.setAvatar(userAvatarSeed);
        };

        asyncCreateRoom();

        return () => {
            if (!roomComplete.current) {
                socketClient.withdraw();
            }
        };
    }, [userAvatarSeed, username]);

    useOnJoinSingle(({ responseStatus }) => {
        if (!roomId) return;
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

    return (
        <Container>
            <AvatarVersus
                left={{
                    seed: userAvatarSeed,
                    username,
                }}
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
            <GameCode
                title="Press to copy game link"
                onClick={() => handleCopyLink()}
            >
                <AnimatePresence>
                    {roomId && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            <svg
                                width="1.5625rem"
                                height="1.5625rem"
                                viewBox="0 0 25 25"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M15.9474 9.05183C18.8647 11.9722 18.8247 16.6543 15.965 19.5299C15.9596 19.5357 15.9532 19.5421 15.9474 19.5479L12.6661 22.8292C9.77209 25.7232 5.06365 25.7228 2.17004 22.8292C-0.723999 19.9356 -0.723999 15.2266 2.17004 12.3331L3.98186 10.5213C4.46233 10.0408 5.28977 10.3601 5.31458 11.0391C5.34622 11.9045 5.50139 12.7739 5.78772 13.6134C5.88469 13.8977 5.81541 14.2121 5.603 14.4245L4.96399 15.0635C3.59553 16.432 3.55261 18.6602 4.90759 20.0421C6.27595 21.4375 8.52507 21.4458 9.90393 20.067L13.1852 16.7862C14.5617 15.4097 14.5559 13.1848 13.1852 11.814C13.0045 11.6337 12.8224 11.4935 12.6802 11.3956C12.5797 11.3266 12.4966 11.2349 12.4377 11.1281C12.3788 11.0212 12.3457 10.902 12.341 10.7801C12.3217 10.2641 12.5045 9.73245 12.9122 9.32473L13.9403 8.29666C14.2098 8.02708 14.6327 7.99397 14.9453 8.21213C15.3033 8.46211 15.6386 8.74309 15.9474 9.05183ZM22.829 2.1699C19.9354 -0.723755 15.2269 -0.724145 12.3329 2.1699L9.05164 5.45115C9.04578 5.45701 9.03943 5.46335 9.03406 5.46921C6.17439 8.3448 6.1343 13.0269 9.05164 15.9472C9.36037 16.256 9.69566 16.5369 10.0536 16.7869C10.3662 17.0051 10.7892 16.9719 11.0587 16.7024L12.0867 15.6743C12.4945 15.2666 12.6773 14.7349 12.6579 14.2189C12.6533 14.097 12.6202 13.9778 12.5613 13.871C12.5024 13.7641 12.4193 13.6725 12.3187 13.6034C12.1765 13.5055 11.9945 13.3654 11.8138 13.185C10.443 11.8142 10.4373 9.58933 11.8138 8.21282L15.095 4.93206C16.4739 3.5532 18.723 3.5615 20.0914 4.95696C21.4464 6.33879 21.4035 8.56702 20.035 9.93547L19.396 10.5745C19.1836 10.7869 19.1143 11.1013 19.2113 11.3856C19.4976 12.2252 19.6528 13.0946 19.6844 13.9599C19.7093 14.6389 20.5366 14.9582 21.0171 14.4778L22.8289 12.6659C25.723 9.77244 25.723 5.06345 22.829 2.1699Z"
                                    fill="#674DEF"
                                />
                            </svg>
                            <span style={{ marginLeft: "1rem" }}>
                                {roomId.toUpperCase()}
                            </span>
                        </motion.div>
                    )}
                </AnimatePresence>
            </GameCode>
            <AnimatePresence>
                {linkCopied && (
                    <DisappearingNotification
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{
                            opacity: 0,
                            y: 40,
                            transition: { duration: 0.2 },
                        }}
                    >
                        <svg
                            width="1rem"
                            height="1rem"
                            viewBox="0 0 25 25"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M15.9474 9.05183C18.8647 11.9722 18.8247 16.6543 15.965 19.5299C15.9596 19.5357 15.9532 19.5421 15.9474 19.5479L12.6661 22.8292C9.77209 25.7232 5.06365 25.7228 2.17004 22.8292C-0.723999 19.9356 -0.723999 15.2266 2.17004 12.3331L3.98186 10.5213C4.46233 10.0408 5.28977 10.3601 5.31458 11.0391C5.34622 11.9045 5.50139 12.7739 5.78772 13.6134C5.88469 13.8977 5.81541 14.2121 5.603 14.4245L4.96399 15.0635C3.59553 16.432 3.55261 18.6602 4.90759 20.0421C6.27595 21.4375 8.52507 21.4458 9.90393 20.067L13.1852 16.7862C14.5617 15.4097 14.5559 13.1848 13.1852 11.814C13.0045 11.6337 12.8224 11.4935 12.6802 11.3956C12.5797 11.3266 12.4966 11.2349 12.4377 11.1281C12.3788 11.0212 12.3457 10.902 12.341 10.7801C12.3217 10.2641 12.5045 9.73245 12.9122 9.32473L13.9403 8.29666C14.2098 8.02708 14.6327 7.99397 14.9453 8.21213C15.3033 8.46211 15.6386 8.74309 15.9474 9.05183ZM22.829 2.1699C19.9354 -0.723755 15.2269 -0.724145 12.3329 2.1699L9.05164 5.45115C9.04578 5.45701 9.03943 5.46335 9.03406 5.46921C6.17439 8.3448 6.1343 13.0269 9.05164 15.9472C9.36037 16.256 9.69566 16.5369 10.0536 16.7869C10.3662 17.0051 10.7892 16.9719 11.0587 16.7024L12.0867 15.6743C12.4945 15.2666 12.6773 14.7349 12.6579 14.2189C12.6533 14.097 12.6202 13.9778 12.5613 13.871C12.5024 13.7641 12.4193 13.6725 12.3187 13.6034C12.1765 13.5055 11.9945 13.3654 11.8138 13.185C10.443 11.8142 10.4373 9.58933 11.8138 8.21282L15.095 4.93206C16.4739 3.5532 18.723 3.5615 20.0914 4.95696C21.4464 6.33879 21.4035 8.56702 20.035 9.93547L19.396 10.5745C19.1836 10.7869 19.1143 11.1013 19.2113 11.3856C19.4976 12.2252 19.6528 13.0946 19.6844 13.9599C19.7093 14.6389 20.5366 14.9582 21.0171 14.4778L22.8289 12.6659C25.723 9.77244 25.723 5.06345 22.829 2.1699Z"
                                fill="#674DEF"
                            />
                        </svg>
                        <span>Link Copied</span>
                    </DisappearingNotification>
                )}
            </AnimatePresence>
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

const GameCode = styled.div`
    background: ${(props) => props.theme.colors.lobby.backdrop.shadedLight};

    font-weight: 700;
    font-size: 2.25rem;
    line-height: 2.9375rem;
    height: 5.4375rem;

    letter-spacing: 0.2em;

    color: ${(props) => props.theme.colors.lobby.info.heading};

    display: grid;
    place-items: center;
    padding: 1.375rem 0;

    border-radius: 0 0 0.75rem 0.75rem;

    cursor: pointer;
`;

const DisappearingNotification = styled(motion.div)`
    align-self: center;

    position: fixed;
    top: 2rem;
    width: 10rem;
    height: 2.4rem;
    background: white;

    font-weight: 500;

    display: flex;
    align-items: center;
    justify-content: space-between;

    padding: 0 1rem;

    border-radius: 0.25rem;
`;

export default CreateRoomPage;
