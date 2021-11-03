import { useEffect, useRef } from "react";
import { StartResponse } from "../../../api/types/transport";
import socket from "../../../api/socketClient";

export const useOnStart = (callback: (res: StartResponse) => void) => {
    const ref = useRef(callback);

    useEffect(() => {
        socket.subscribeStartResponse((res) => {
            ref.current(res);
        });
    }, []);
};

export const useOnStartSingle = (callback: (res: StartResponse) => void) => {
    const guarded = useRef(false);
    const ref = useRef(callback);

    if (!guarded.current) ref.current = callback;

    useEffect(() => {
        socket.subscribeStartResponse((res) => {
            if (guarded.current) return;
            guarded.current = true;
            ref.current(res);
        });
    }, []);
};
