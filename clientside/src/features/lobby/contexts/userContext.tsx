import { createContext, useContext } from "react";

// initializes with empty Product
export const UserContext = createContext<{
    username: string;
    userAvatarSeed: string;
    isAdmin: boolean;
    setUsername: (username: string) => void;
    setUserAvatarSeed: (userAvatarSeed: string) => void;
    setIsAdmin: (isAdmin: boolean) => void;
}>({
    username: "",
    userAvatarSeed: "",
    isAdmin: false,
    setUsername: () => {},
    setUserAvatarSeed: () => {},
    setIsAdmin: () => {},
});

export const useUserContext = () => useContext(UserContext);
