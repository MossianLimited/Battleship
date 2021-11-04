import {
    useCallback,
    useState,
    useEffect,
    useRef,
    useLayoutEffect,
} from "react";
import styled from "styled-components";
import socketClient from "../../../api/socketClient";
import { Tag } from "../../lobby/components/base.styled";
import BasicButton from "../../lobby/components/basicButton";
import { useChatContext } from "../contexts/chatContext";

const Chatbox = () => {
    const inputRef = useRef<HTMLInputElement>(null);
    const chatContext = useChatContext();

    const { addMessage } = chatContext[chatContext.chatSide];

    const [inputFocused, setInputFocused] = useState<boolean>(false);
    const [message, setMessage] = useState("");

    const sendChat = useCallback(() => {
        if (!message) return;
        socketClient.sendChat(message);
        addMessage(message);
        setMessage("");
    }, [message, addMessage]);

    useOnKeyDown(
        useCallback(
            (e: KeyboardEvent) => {
                if (e.key === "Enter") sendChat();
                else if (e.key === "Escape") setInputFocused(false);
                else if (e.key === "t" && !inputFocused) {
                    e.preventDefault(); 
                    setInputFocused(true);
                }
            },
            [sendChat, inputFocused]
        )
    );

    useLayoutEffect(() => {
        if (inputFocused) inputRef.current?.focus();
        else inputRef.current?.blur();
    }, [inputFocused]);

    return (
        <Container
            className="chatParent"
            onClick={() => {
                setInputFocused(true);
                inputRef.current?.focus();
            }}
        >
            <StyledInput
                ref={inputRef}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onBlur={(e) => setInputFocused(false)}
            />
            {!inputFocused && !message && (
                <HintBox>
                    Press <Tag>t</Tag> to type in chat and <Tag>Enter</Tag> to
                    send
                </HintBox>
            )}
            <SendButton className="chatSendBtn" onClick={() => sendChat()}>
                Send
            </SendButton>
        </Container>
    );
};

export default Chatbox;

function useOnKeyDown(callback: (e: KeyboardEvent) => void) {
    useEffect(() => {
        document.addEventListener("keydown", callback);
        return () => {
            document.removeEventListener("keydown", callback);
        };
    }, [callback]);
}

const Container = styled.div`
    width: 38.9375rem;
    height: 3rem;
    background: #ffffff;
    border-radius: 0.75rem;

    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 1rem; 

    cursor: pointer;
`;

const StyledInput = styled.input`
    padding-left: 1.75rem;
    padding-right: 0.5rem;
    height: 100%;
    flex: 1;
    font-family: DM Sans;
    font-size: 1rem;
    color: #15046d;
`;

const HintBox = styled.div`
    margin-left: 1.75rem;
    user-select: none;
    pointer-events: none;
    position: absolute;
    color: #200c83;
`;

const SendButton = styled(BasicButton)`
    height: 2.125rem;
    width: 4.875rem;
    margin-right: 0.5rem;
`;
