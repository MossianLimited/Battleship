import { useHistory } from "react-router";
import styled from "styled-components";
import { HeaderText, WhiteBox } from "../components/base.styled";
import BasicButton from "../components/basicButton";
import BasicInput from "../components/basicInput";
import { useUserContext } from "../contexts/userContext";
import LabelWrapper from "../wrappers/labelWrapper";
import LobbyLayoutWrapper from "../wrappers/lobbyLayoutWrapper";

const WelcomePage = () => {
    const history = useHistory();
    const { username, setUsername } = useUserContext();

    const validateUsername = () => {
        if (!username) {
            alert("You need to fill in a username");
            return false;
        }
        return true;
    };

    return (
        <LobbyLayoutWrapper>
            <Container>
                <FormBox
                    onSubmit={() =>
                        validateUsername() && history.push("/new-room")
                    }
                >
                    <Title>
                        <span>Battleship</span>
                        <span>🚢</span>
                    </Title>
                    <LabelWrapper label="Enter your display name">
                        <BasicInput
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Tofu, Dinger, Wasu, or etc."
                        />
                    </LabelWrapper>
                    <ButtonContainer>
                        <BasicButton
                            type="button"
                            variant="secondary"
                            name="rooms"
                            onClick={() =>
                                validateUsername() && history.push("/rooms")
                            }
                        >
                            Join Room
                        </BasicButton>
                        <BasicButton
                            type="button"
                            variant="primary"
                            name="newRoom"
                            onClick={() =>
                                validateUsername() && history.push("/new-room")
                            }
                        >
                            Create Room
                        </BasicButton>
                    </ButtonContainer>
                </FormBox>
                <ExperimentalZone>
                    <LabelWrapper label="Or try our experimental features">
                        <BasicButton type="button" variant="secondary">
                            Single Mode
                        </BasicButton>
                    </LabelWrapper>
                </ExperimentalZone>
            </Container>
        </LobbyLayoutWrapper>
    );
};

const Container = styled(WhiteBox)``;

const FormBox = styled.form`
    display: flex;
    flex-flow: column;

    padding: 1.75rem 2rem 0;
`;

const Title = styled(HeaderText)`
    display: flex;
    justify-content: space-between;

    font-weight: 600;
    font-size: 1.5rem;
    line-height: 1.8125rem;

    margin-bottom: 1.6875rem;
    font-family: "Montserrat", sans-serif;
`;

const ButtonContainer = styled.div`
    display: flex;
    gap: 0.9375rem;

    margin: 1.875rem 0 1.5rem;

    & > * {
        flex: 1;
    }
`;

const ExperimentalZone = styled.div`
    background: ${(props) => props.theme.colors.lobby.backdrop.shadedLight};

    padding: 1.1875rem 2rem 1.75rem;
`;

export default WelcomePage;
