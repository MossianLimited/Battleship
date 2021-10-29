import { io, Socket } from "socket.io-client";
import { API_URL, SOCKET_EVENT } from "./constants/config";

class SocketClient {
    private socket?: Socket;

    constructor() {
        this.initSocket();
    }

    private initSocket() {
        this.socket = io(API_URL);
    }

    public subscribeToSocketID() {
        if (this.socket) {
            this.socket.on(SOCKET_EVENT.SOCKET_ID, (socketId: string) => {
                console.log("Connected to socket ID:", socketId);
            });
        }
    }

    public createRoom(username: string, password: string) {
        if (this.socket) {
            this.socket.emit(SOCKET_EVENT.CREATE_ROOM, { username, password });
        }
    }

    public subscribeToRoomCreated(callbackFn: (roomId: string) => void) {
        if (this.socket) {
            this.socket.on(
                SOCKET_EVENT.CREATE_ROOM_RESPONSE,
                (_statusMessage: string, roomId: string) => {
                    callbackFn(roomId);
                }
            );
        }
    }

    public joinRoom(username: string, roomId: string) {
        if (this.socket) {
            this.socket.emit(SOCKET_EVENT.JOIN_ROOM, { username, roomId });
        }
    }

    public subscribeToRoomJoined(
        callbackFn: (statusMessage: string, roomId: string) => void
    ) {
        if (this.socket) {
            this.socket.on(
                SOCKET_EVENT.JOIN_ROOM_RESPONSE,
                (statusMessage: string, roomId: string) => {
                    callbackFn(statusMessage, roomId);
                }
            );
        }
    }

    public disconnect() {
        if (this.socket) this.socket.disconnect();
    }
}

const socketClient = new SocketClient(); // singleton pattern

export default socketClient;
