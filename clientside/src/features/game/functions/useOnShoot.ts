import { useEffect, useRef } from "react";
import socket from "../../../api/socketClient";
import { ShootResponse } from "../../../api/types/transport";

export const useOnShoot = (callback: (res: ShootResponse) => void) => {
    const ref = useRef(callback);

    useEffect(() => {
        socket.subscribeShootResponse((res) => {
            ref.current(res);
        });
    }, []);
};

export const useOnShootSingle = (callback: (res: ShootResponse) => void) => {
    const guarded = useRef(false);
    const ref = useRef(callback);

    if (!guarded.current) ref.current = callback;

    useEffect(() => {
        socket.subscribeShootResponse((res) => {
            if (guarded.current) return;
            guarded.current = true;
            ref.current(res);
        });
    }, []);
};
