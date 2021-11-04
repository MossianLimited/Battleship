import { useEffect, useRef } from "react";
import { ShipDestroyedResponse } from "../../../api/types/transport";
import socket from "../../../api/socketClient";

export const useOnShipDestroyed = (callback: (res: ShipDestroyedResponse) => void) => {
    const ref = useRef(callback);

    ref.current = callback; 

    useEffect(() => {
        socket.subscribeShipDestroyed((res) => {
            ref.current(res);
        });
    }, []);
};

export const useOnShipDestroyedSingle = (callback: (res: ShipDestroyedResponse) => void) => {
    const guarded = useRef(false);
    const ref = useRef(callback);

    if (!guarded.current) ref.current = callback;

    useEffect(() => {
        socket.subscribeShipDestroyed((res) => {
            if (guarded.current) return;
            guarded.current = true;
            ref.current(res);
        });
    }, []);
};
