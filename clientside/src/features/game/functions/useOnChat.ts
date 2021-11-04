import { useEffect, useRef } from "react";
import socket from "../../../api/socketClient";

export const useOnChat = (callback: (msg: string) => void) => {
    const ref = useRef(callback);

    ref.current = callback; 

    useEffect(() => {
        socket.subscribeChat((msg) => {
            ref.current(msg);
        });
    }, []);
};

export const useOnChatSingle = (callback: (msg: string) => void) => {
    const guarded = useRef(false);
    const ref = useRef(callback);

    if (!guarded.current) ref.current = callback;

    useEffect(() => {
        socket.subscribeChat((msg) => {
            if (guarded.current) return;
            guarded.current = true;
            ref.current(msg);
        });
    }, []);
};
