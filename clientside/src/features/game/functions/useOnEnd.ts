import { useEffect, useRef } from "react";
import socket from "../../../api/socketClient";
import { EndResponse } from "../../../api/types/transport";

export const useOnEnd = (callback: (res: EndResponse) => void) => {
    const ref = useRef(callback);

    useEffect(() => {
        socket.subscribeEndResponse((res) => {
            ref.current(res);
        });
    }, []);
};

export const useOnEndSingle = (callback: (res: EndResponse) => void) => {
    const guarded = useRef(false);
    const ref = useRef(callback);

    if (!guarded.current) ref.current = callback;

    useEffect(() => {
        socket.subscribeEndResponse((res) => {
            if (guarded.current) return;
            guarded.current = true;
            ref.current(res);
        });
    }, []);
};
