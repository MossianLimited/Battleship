import { createContext, useContext } from "react";

// initializes with empty Product
export const UserContext = createContext<{
    username: string;
    setUsername: (username: string) => void;
}>({
    username: "",
    setUsername: () => {},
});

export const useUserContext = () => useContext(UserContext);
