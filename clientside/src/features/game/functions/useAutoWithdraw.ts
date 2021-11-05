import { useEffect, useRef } from "react";
import socketClient from "../../../api/socketClient";
import { useHistory } from "react-router";

const useAutoWithdraw = (): [() => boolean, () => void] => {
    const history = useHistory();

    const duplicateGuard = useRef<boolean>(false);
    const guarded = () => duplicateGuard.current;

    useEffect(() => {
        return () => {
            // eslint-disable-next-line react-hooks/exhaustive-deps
            if (!duplicateGuard.current) {
                duplicateGuard.current = true;
                socketClient.withdraw();
            }
        };
    }, []);

    const forceWithdraw = () => {
        if (guarded()) return;
        duplicateGuard.current = true;
        socketClient.withdraw();
        history.push("/");
    };

    return [guarded, forceWithdraw];
};

export default useAutoWithdraw;
