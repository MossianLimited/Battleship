import { useCallback, useEffect, useState } from "react";

const charList =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
const MAX_TIME_LIMIT = 5000;

const useKeySequenceListener = (
    onSequenceSubmitCallback: (sequence: string) => Promise<void>
) => {
    const [buffer, setBuffer] = useState<string[]>([]);
    const [lastKeyTime, setLastKeyTime] = useState<number>(Date.now());

    const keySequenceListener = useCallback(
        async (e: KeyboardEvent) => {
            const key = e.key;

            if (key === "Enter") {
                await onSequenceSubmitCallback(buffer.join(""));
                setBuffer([]);
            }
            if (!charList.includes(key)) return;

            const currentTime = Date.now();

            if (currentTime - lastKeyTime > MAX_TIME_LIMIT) setBuffer([]);

            setBuffer((buffer) => [...buffer, key]);

            setLastKeyTime(currentTime);
        },
        [buffer, lastKeyTime, onSequenceSubmitCallback]
    );

    useEffect(() => {
        document.addEventListener("keydown", keySequenceListener);
        return () => {
            document.removeEventListener("keydown", keySequenceListener);
        };
    }, [keySequenceListener]);
};

export default useKeySequenceListener;
