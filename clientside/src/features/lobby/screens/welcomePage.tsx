import { useHistory } from "react-router";
import styled from "styled-components";
import useQuery from "../../routing/hooks/useQuery";
import { HeaderText, WhiteBox } from "../components/base.styled";
import BasicButton from "../components/basicButton";
import BasicInput from "../components/basicInput";
import AvatarSelector from "../../avatar/components/avatarSelector";
import { useUserContext } from "../contexts/userContext";
import LabelWrapper from "../wrappers/labelWrapper";
import LobbyLayoutWrapper from "../wrappers/lobbyLayoutWrapper";

const WelcomePage = () => {
    const history = useHistory();
    const query = useQuery();

    const roomId = query.get("roomId");

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
            <Rectangle />
            <Container>
                <Title>
                    <svg
                        width="100"
                        height="60"
                        viewBox="0 0 100 60"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M8.469 45.798L4 41.28L18.131 41.296L18.125 39.515H30.151L30.141 37.062H42.151L42.11 34.437H43.448V31.375H49.11L49.799 18.974H47.36L47.372 18.331H49.798L49.923 14H50.319L50.402 18.274H52.673L52.694 18.974H50.452L51.11 31.374H54.563L54.522 26.592C53.946 26.323 53.547 25.739 53.547 25.062C53.547 24.13 54.303 23.374 55.235 23.374H56.381C57.313 23.374 58.069 24.129 58.069 25.062C58.069 25.716 57.696 26.284 57.151 26.563L57.172 31.187H59.976V35.375H69.047V36.343L93.276 36.355L96.096 36.188L88.859 45.799"
                            fill="white"
                        />
                        <path
                            d="M8.46875 40.5H14.9377V36C14.9377 36 8.56275 35.813 8.46875 40.5Z"
                            fill="white"
                        />
                        <path
                            d="M28.49 38.708H22.021V34.208C22.022 34.208 28.397 34.021 28.49 38.708Z"
                            fill="white"
                        />
                        <path
                            d="M80.8811 35.812H74.4121V31.312C74.4121 31.312 80.7871 31.125 80.8811 35.812Z"
                            fill="white"
                        />
                        <path
                            d="M9.74523 36.791L5.85023 35.374L5.61523 36.02L9.10123 37.289C9.10023 37.289 9.40423 36.987 9.74523 36.791Z"
                            fill="white"
                        />
                        <path
                            d="M27.0132 34.957L30.9092 33.539L31.1442 34.185L27.6582 35.454C27.6582 35.454 27.3542 35.152 27.0132 34.957Z"
                            fill="white"
                        />
                        <path
                            d="M79.3462 32.022L83.2422 30.604L83.4772 31.25L79.9912 32.519C79.9912 32.52 79.6872 32.218 79.3462 32.022Z"
                            fill="white"
                        />
                    </svg>
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
        </LobbyLayoutWrapper>
    );
};

const Rectangle = styled.div`
    position: absolute;
    width: 112rem;
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

export default WelcomePage;
