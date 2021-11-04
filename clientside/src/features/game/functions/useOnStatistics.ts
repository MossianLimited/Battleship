import { useEffect, useRef } from "react";
import { StatResponse } from "../../../api/types/transport";
import socket from "../../../api/socketClient";

export const useOnStatistics = (callback: (res: StatResponse) => void) => {
    const ref = useRef(callback);

    ref.current = callback; 

    useEffect(() => {
        socket.subscribeStatistic((res) => {
            ref.current(res);
        });
    }, []);
};

export const useOnStatisticsSingle = (callback: (res: StatResponse) => void) => {
    const guarded = useRef(false);
    const ref = useRef(callback);

    if (!guarded.current) ref.current = callback;

    useEffect(() => {
        socket.subscribeStatistic((res) => {
            if (guarded.current) return;
            guarded.current = true;
            ref.current(res);
        });
    }, []);
};
