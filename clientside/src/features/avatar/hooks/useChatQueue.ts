import { useCallback, useState } from "react";
import { Message } from "../../game/types/chat";

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
            }, 6000);
        },
        [removeMessage]
    );

    return { addMessage, removeMessage, queue };
};

export default useChatQueue;
