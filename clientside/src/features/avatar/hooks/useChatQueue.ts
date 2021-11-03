import { useState, useCallback } from "react";

const useChatQueue = () => {
    const [queue, setQueue] = useState<string[]>([]);

    const addMessage = useCallback((message: string) => {
        setQueue((queue) => [message, ...queue]);
        setTimeout(() => {
            setQueue((queue) => queue.slice(0, -1));
        }, 5000);
    }, []);

    return { addMessage, queue };
};

export default useChatQueue;
