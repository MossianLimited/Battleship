import { useCallback, useState, useEffect, useRef } from "react";
import styled from "styled-components";
import socketClient from "../../../api/socketClient";
import { Tag } from "../../lobby/components/base.styled";
import BasicButton from "../../lobby/components/basicButton";
import { useChatContext } from "../contexts/chatContext";

const Chatbox = () => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [inputFocused, setInputFocused] = useState<boolean>(false);

    const chatContext = useChatContext();

    const { addMessage } = chatContext[chatContext.chatSide];

    const sendChat = useCallback(() => {
        if (inputRef.current?.value) {
            const message = inputRef.current?.value;
            socketClient.sendChat(message);
            addMessage(message);
            inputRef.current.value = "";
        }
    }, [addMessage]);

    const onKeyDownCallback = useCallback(
        (e: KeyboardEvent) => {
            if (e.key === "Enter") {
                sendChat();
            } else if (e.key === "t") {
                setInputFocused(true);
                setTimeout(() => {
                    inputRef.current?.focus();
                }, 100);
            } else if (e.key === "Escape") {
                setInputFocused(false);
                inputRef.current?.blur();
            }
        },
        [sendChat]
    );

    // listen to keypress events for t and enter
    useEffect(() => {
        document.addEventListener("keydown", onKeyDownCallback);
        return () => {
            document.removeEventListener("keydown", onKeyDownCallback);
        };
    }, [onKeyDownCallback]);

    return (
        <Container
            className="chatParent"
            onClick={() => {
                if (!inputFocused) {
                    setInputFocused(true);
                    inputRef.current?.focus();
                }
            }}
        >
            {inputFocused ? (
                <StyledInput
                    ref={inputRef}
                    onBlur={(e) => {
                        if (
                            !e.relatedTarget?.className.endsWith(
                                "chatSendBtn"
                            ) &&
                            !e.relatedTarget?.className.endsWith("chatParent")
                        )
                            setInputFocused(false);
                    }}
                />
            ) : (
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

const Container = styled.div`
    width: 38.9375rem;
    height: 3rem;
    background: #ffffff;
    border-radius: 0.75rem;

    display: flex;
    align-items: center;
    justify-content: space-between;

    cursor: pointer;
`;

const StyledInput = styled.input`
    padding-left: 1.75rem;
    padding-right: 0.5rem;
    height: 100%;
    flex: 1;
    font-family: DM Sans;
`;

const HintBox = styled.div`
    margin-left: 1.75rem;
    user-select: none;
`;

const SendButton = styled(BasicButton)`
    height: 2.125rem;
    width: 4.875rem;
    margin-right: 0.5rem;
`;

export default Chatbox;
