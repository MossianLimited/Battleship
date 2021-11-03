import { useState } from "react";
import styled from "styled-components";
import { useUserContext } from "../../lobby/contexts/userContext";
import UserAvatar from "./userAvatar";

const DEFAULT_AVATARS: string[] = ["nnaries", "wt", "dinger", "rocks"];

const getRandomSeed = (): string => {
    return Math.random().toString(36).substring(2, 5);
};

const getDefaultAvatars = (): string[] => {
    const savedAvatarSeed = localStorage.getItem("userAvatarSeed");

    return DEFAULT_AVATARS.reduce((acc, seed, idx) => {
        if (idx === 0 && savedAvatarSeed) return [savedAvatarSeed];
        if (seed === savedAvatarSeed) {
            let randomSeed = getRandomSeed();
            while (acc.includes(randomSeed)) randomSeed = getRandomSeed();
            return [...acc, randomSeed];
        }
        return [...acc, seed];
    }, [] as string[]);
};

const AvatarSelector = () => {
    const [randomSeeds, setRandomSeeds] = useState<string[]>(
        getDefaultAvatars()
    );
    const { userAvatarSeed: actualUserAvatarSeed, setUserAvatarSeed } =
        useUserContext();
    const userAvatarSeed = actualUserAvatarSeed || randomSeeds[0];

    const displayedAvatars = randomSeeds.map((seed) => (
        <UserAvatar
            key={seed}
            seed={seed}
            isRounded
            isSelected={seed === userAvatarSeed}
            onClickHandler={() => {
                setUserAvatarSeed(seed);
                localStorage.setItem("userAvatarSeed", seed);
            }}
        />
    ));

    const handleRandomize = () => {
        const newSeeds: string[] = randomSeeds.reduce((acc, seed) => {
            if (seed === userAvatarSeed) return [...acc, seed];
            let randomSeed = getRandomSeed();
            while (acc.includes(randomSeed)) randomSeed = getRandomSeed();
            return [...acc, randomSeed];
        }, [] as string[]);
        setRandomSeeds(newSeeds);
    };

    return (
        <Container>
            <AvatarContainer>{displayedAvatars}</AvatarContainer>
            <DiceButton onClick={handleRandomize}>
                <svg
                    width="1.5625rem"
                    height="1.25rem"
                    viewBox="0 0 25 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M22.2278 7.62792H17.7751C18.251 8.73754 18.0421 10.0729 17.1376 10.9774L12.0278 16.0872V17.8279C12.0278 18.822 12.8337 19.6279 13.8278 19.6279H22.2278C23.222 19.6279 24.0278 18.822 24.0278 17.8279V9.42792C24.0278 8.43379 23.222 7.62792 22.2278 7.62792ZM18.0278 14.5279C17.531 14.5279 17.1278 14.1248 17.1278 13.6279C17.1278 13.1307 17.531 12.7279 18.0278 12.7279C18.5247 12.7279 18.9278 13.1307 18.9278 13.6279C18.9278 14.1248 18.5247 14.5279 18.0278 14.5279ZM16.289 7.52667L9.72908 0.966792C9.01058 0.248292 7.84546 0.248292 7.12696 0.966792L0.566707 7.52667C-0.151793 8.24517 -0.151793 9.41029 0.566707 10.1288L7.12658 16.689C7.84508 17.4075 9.01021 17.4075 9.72871 16.689L16.289 10.1292C17.0075 9.41029 17.0075 8.24517 16.289 7.52667ZM3.62783 9.72792C3.13096 9.72792 2.72783 9.32479 2.72783 8.82792C2.72783 8.33067 3.13096 7.92792 3.62783 7.92792C4.12471 7.92792 4.52783 8.33067 4.52783 8.82792C4.52783 9.32479 4.12471 9.72792 3.62783 9.72792ZM8.42783 14.5279C7.93096 14.5279 7.52783 14.1248 7.52783 13.6279C7.52783 13.1307 7.93096 12.7279 8.42783 12.7279C8.92471 12.7279 9.32783 13.1307 9.32783 13.6279C9.32783 14.1248 8.92471 14.5279 8.42783 14.5279ZM8.42783 9.72792C7.93096 9.72792 7.52783 9.32479 7.52783 8.82792C7.52783 8.33067 7.93096 7.92792 8.42783 7.92792C8.92471 7.92792 9.32783 8.33067 9.32783 8.82792C9.32783 9.32479 8.92471 9.72792 8.42783 9.72792ZM8.42783 4.92792C7.93096 4.92792 7.52783 4.52479 7.52783 4.02792C7.52783 3.53067 7.93096 3.12792 8.42783 3.12792C8.92471 3.12792 9.32783 3.53067 9.32783 4.02792C9.32783 4.52479 8.92471 4.92792 8.42783 4.92792ZM13.2278 9.72792C12.731 9.72792 12.3278 9.32479 12.3278 8.82792C12.3278 8.33067 12.731 7.92792 13.2278 7.92792C13.7247 7.92792 14.1278 8.33067 14.1278 8.82792C14.1278 9.32479 13.7247 9.72792 13.2278 9.72792Z"
                        fill="white"
                    />
                </svg>
            </DiceButton>
        </Container>
    );
};

const Container = styled.div`
    height: 9.0625rem;

    background: ${(props) => props.theme.colors.lobby.avatar.background.light};

    padding: 1.75rem;

    display: flex;
    justify-content: space-between;
    align-items: center;

    border-radius: 0.75rem 0.75rem 0 0;
`;

const AvatarContainer = styled.div`
    display: flex;
    align-items: center;

    & > * {
        cursor: pointer;
        margin-right: 1rem;
    }
`;

const DiceButton = styled.div`
    height: 3rem;
    width: 3rem;

    display: grid;
    place-items: center;

    background: ${(props) => props.theme.colors.lobby.avatar.background.medium};

    border-radius: 0.75rem;

    cursor: pointer;
`;

export default AvatarSelector;
