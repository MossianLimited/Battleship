import { useEffect, useRef } from "react";
import { AvatarResponse } from "../../../api/types/transport";
import socket from "../../../api/socketClient";

export const useOnAvatar = (callback: (res: AvatarResponse) => void) => {
    const ref = useRef(callback);

    useEffect(() => {
        socket.subscribeAvatarResponse((res) => {
            ref.current(res);
        });
    }, []);
};

export const useOnAvatarSingle = (callback: (res: AvatarResponse) => void) => {
    const guarded = useRef(false);
    const ref = useRef(callback);

    if (!guarded.current) ref.current = callback;

    useEffect(() => {
        socket.subscribeAvatarResponse((res) => {
            if (guarded.current) return;
            guarded.current = true;
            ref.current(res);
        });
    }, []);
};
