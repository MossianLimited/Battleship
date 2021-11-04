import { useEffect, useRef } from "react";
import socket from "../../../api/socketClient";
import { JoinRoomResponse } from "../../../api/types/transport";

export const useOnJoin = (callback: (res: JoinRoomResponse) => void) => {
    const ref = useRef(callback);

    ref.current = callback;

    useEffect(() => {
        socket.subscribeJoinResponse((res) => {
            ref.current(res);
        });
    }, []);
};

export const useOnJoinSingle = (callback: (res: JoinRoomResponse) => void) => {
    const guarded = useRef(false);
    const ref = useRef(callback);

    if (!guarded.current) ref.current = callback;

    useEffect(() => {
        socket.subscribeJoinResponse((res) => {
            if (guarded.current) return;
            guarded.current = true;
            ref.current(res);
        });

        return () => {
            guarded.current = true; 
        }
    }, []);
};
