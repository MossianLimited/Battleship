import { useHistory } from "react-router";
import styled from "styled-components";
import useQuery from "../../routing/hooks/useQuery";
import { Backdrop, HeaderText, WhiteBox } from "../components/base.styled";
import BasicButton from "../components/basicButton";
import BasicInput from "../components/basicInput";
import AvatarSelector from "../../avatar/components/avatarSelector";
import { useUserContext } from "../contexts/userContext";
import LabelWrapper from "../wrappers/labelWrapper";
import LobbyLayoutWrapper from "../wrappers/lobbyLayoutWrapper";
import { useState } from "react";
import BattleshipIcon from "../components/battleshipIcon";
import useKeySequenceListener from "../hooks/useKeySequenceListener";
import socketClient from "../../../api/socketClient";

const WelcomePage = () => {
    const history = useHistory();
    const query = useQuery();

    const roomId = query.get("roomId");

    const { username, setUsername, setIsAdmin } = useUserContext();

    const [showUsernameAlert, setShowUsernameAlert] = useState<boolean>(false);

    // admin cheat code login (but password is verified on server so it's secure)
    useKeySequenceListener(async (sequence) => {
        try {
            await socketClient.adminLogin(sequence);
            setIsAdmin(true);
            history.push("/rooms?spectator=true");
        } catch (e) {} // fail silently
    });

    const validateUsername = () => {
        setShowUsernameAlert(!username);
        return !!username;
    };

    return (
        <LobbyLayoutWrapper>
            <Rectangle />
            <Container>
                <Title>
                    <BattleshipIcon />
                    <span>Battleship</span>
                </Title>
                <AvatarSelector />
                <FormBox
                    onSubmit={() =>
                        validateUsername() && history.push("/rooms")
                    }
                >
                    <LabelWrapper label="Enter your display name">
                        <BasicInput
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Tofu, Dinger, Wasu, or etc."
                        />
                    </LabelWrapper>
                    <ButtonContainer>
                        {!roomId && (
                            <BasicButton
                                type="button"
                                variant="secondary"
                                name="newRoom"
                                onClick={() =>
                                    validateUsername() && history.push("/new")
                                }
                            >
                                Create Room
                            </BasicButton>
                        )}

                        <BasicButton
                            type="button"
                            variant="primary"
                            name="rooms"
                            onClick={() =>
                                validateUsername() && history.push("/rooms")
                            }
                        >
                            Join Room
                        </BasicButton>
                    </ButtonContainer>
                </FormBox>
                {/* <ExperimentalZone>
                    <LabelWrapper label="Or try our experimental features">
                        <BasicButton type="button" variant="secondary">
                            Single Mode
                        </BasicButton>
                    </LabelWrapper>
                </ExperimentalZone> */}
            </Container>
            {showUsernameAlert && (
                <>
                    <Backdrop onClick={() => setShowUsernameAlert(false)} />
                    <UsernameAlertModal>
                        You need to enter a username
                    </UsernameAlertModal>
                </>
            )}
        </LobbyLayoutWrapper>
    );
};

const Rectangle = styled.div`
    position: absolute;
    width: 150%;
    height: 7.5rem;
    margin: 0 auto;

    background: #7c62ff;
    transform: rotate(-25.47deg);
`;

const Container = styled(WhiteBox)`
    width: 32.3125rem;
    position: relative;
`;

const FormBox = styled.form`
    display: flex;
    flex-flow: column;

    padding: 1.75rem 2rem 0;
`;

const Title = styled(HeaderText)`
    display: flex;
    flex-flow: column;

    & > *:first-child {
        transform: translateY(0.4rem) translateX(-0.4rem);
    }

    position: absolute;

    top: -7.75rem;
    left: 1.875rem;

    color: ${(props) => props.theme.colors.lobby.info.battleship};

    font-weight: 700;
    font-size: 2.25rem;
    line-height: 2.9375rem;
`;

const ButtonContainer = styled.div`
    display: flex;
    gap: 0.9375rem;

    margin: 1.875rem 0 1.5rem;

    & > * {
        &:first-child {
            flex: 0.452;
        }
        &:last-child {
            flex: 0.548;
        }
    }
`;

// const ExperimentalZone = styled.div`
//     background: ${(props) => props.theme.colors.lobby.backdrop.shadedLight};

//     padding: 1.1875rem 2rem 1.75rem;
// `;

const UsernameAlertModal = styled.div`
    z-index: 4;
    position: absolute;
    background: ${(props) => props.theme.colors.lobby.backdrop.light};

    width: 20rem;
    height: 8rem;

    border-radius: 0.75rem;

    display: flex;
    justify-content: center;
    align-items: center;
`;

export default WelcomePage;
