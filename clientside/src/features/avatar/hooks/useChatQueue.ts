import { useCallback, useState } from "react";
import { Message } from "../../game/types/chat";

const CHAT_TIMEOUT = 6000;

const useChatQueue = () => {
    const [queue, setQueue] = useState<Message[]>([]);

    const removeMessage = useCallback(() => {
        setQueue((queue) => queue.slice(0, -1));
    }, []);

    const addMessage = useCallback(
        (message: string) => {
            setQueue((queue) => [
                {
                    timestamp: Date.now(),
                    content: message,
                },
                ...queue,
            ]);
            setTimeout(() => {
                removeMessage();
            }, CHAT_TIMEOUT);
        },
        [removeMessage]
    );

    return { addMessage, removeMessage, queue };
};

export default useChatQueue;
