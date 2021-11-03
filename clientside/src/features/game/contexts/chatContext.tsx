import { createContext, useContext } from "react";
import { AvatarSide } from "../../avatar/types/avatar";
import { Message } from "../types/chat";

// initializes with empty Product
export const ChatContext = createContext<{
    chatSide: AvatarSide;
    left: {
        queue: Message[];
        addMessage: (message: string) => void;
        removeMessage: () => void;
    };
    right: {
        queue: Message[];
        addMessage: (message: string) => void;
        removeMessage: () => void;
    };
}>({
    chatSide: AvatarSide.Left,
    left: {
        queue: [],
        addMessage: () => {},
        removeMessage: () => {},
    },
    right: {
        queue: [],
        addMessage: () => {},
        removeMessage: () => {},
    },
});

export const useChatContext = () => useContext(ChatContext);
