import styled from "styled-components";
import BasicButton from "../components/basicButton";
import BasicInput from "../components/basicInput";
import LabelWrapper from "../wrappers/labelWrapper";
import LobbyLayoutWrapper from "../wrappers/lobbyLayoutWrapper";

const WelcomePage = () => {
    return (
        <LobbyLayoutWrapper>
            <Container>
                <FormBox>
                    <Title>Battleship</Title>
                    <LabelWrapper label="Enter your display name">
                        <BasicInput placeholder="Tofu, Dinger, Wasu, or etc." />
                    </LabelWrapper>
                    <ButtonContainer>
                        <BasicButton type="button" variant="secondary">
                            Join Room
                        </BasicButton>
                        <BasicButton type="button" variant="primary">
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

const Container = styled.div`
    background: ${(props) => props.theme.colors.lobby.backdrop.light};
    border-radius: 0.75rem;

    width: 28.6875rem;

    display: flex;
    flex-flow: column;

    margin: auto 0;
    overflow: hidden;
`;

const FormBox = styled.form`
    display: flex;
    flex-flow: column;

    padding: 1.75rem 2rem 0;
`;

const Title = styled.h1`
    margin: 0;
    margin-bottom: 1.6875rem;
    padding: 0;

    font-weight: 600;
    font-size: 1.5rem;
    line-height: 1.8125rem;

    font-family: "Montserrat", sans-serif;

    color: ${(props) => props.theme.colors.lobby.info.heading};
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
