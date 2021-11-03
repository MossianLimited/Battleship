import { useEffect, useState, useCallback } from "react";

const useChatQueue = () => {
    const [queue, setQueue] = useState<string[]>([]);

    const addMessage = useCallback(
        (message: string) => {
            setQueue([...queue, message]);
        },
        [queue]
    );

    const removeMessage = useCallback(() => {
        setQueue(queue.slice(1));
    }, [queue]);

    useEffect(() => {
        if (queue.length > 0) {
            setTimeout(() => {
                removeMessage();
            }, 1000);
        }
    }, [queue.length, removeMessage]);

    return { addMessage, removeMessage, queue };
};

export default useChatQueue;
