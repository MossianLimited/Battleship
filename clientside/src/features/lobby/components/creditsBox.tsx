import styled from "../../../styles/theme";

const CreditsBox = () => {
    return (
        <Container>
            <div>Authored By</div>
            <div>
                @winnaries @wasurocks
                <br />
                @mossdinger @bosswt
            </div>
        </Container>
    );
};

const Container = styled.div`
    position: absolute;
    bottom: 1.75rem;
    height: 4.6875rem;
    font-family: "DM Mono", sans-serif;

    & > * {
        text-align: center;
        font-size: 1rem;
        line-height: 1.3125rem;
        &:first-child {
            color: ${(props) => props.theme.colors.lobby.credits.light};
            font-weight: 500;
            height: 1.875rem;
        }

        &:last-child {
            color: ${(props) => props.theme.colors.lobby.credits.medium};
            font-weight: 400;
        }
    }
`;

export default CreditsBox;
