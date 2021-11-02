import { createContext, useContext } from "react";

// initializes with empty Product
export const UserContext = createContext<{
    username: string;
    userAvatarSeed: string;
    setUsername: (username: string) => void;
    setUserAvatarSeed: (userAvatarSeed: string) => void;
}>({
    username: "",
    userAvatarSeed: "",
    setUsername: () => {},
    setUserAvatarSeed: () => {},
});

export const useUserContext = () => useContext(UserContext);
