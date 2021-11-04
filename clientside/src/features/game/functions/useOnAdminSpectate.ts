import { useRef, useEffect } from "react";
import { AdminSpectateResponse } from "../../../api/types/transport";
import socket from "../../../api/socketClient";

export const useOnAdminSpectate = (
    callback: (res: AdminSpectateResponse) => void
) => {
    const ref = useRef(callback);

    ref.current = callback;

    useEffect(() => {
        socket.subscribeAdminSpectate((res) => {
            ref.current(res);
        });
    }, []);
};
