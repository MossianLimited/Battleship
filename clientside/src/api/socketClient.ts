import { io, Socket } from "socket.io-client";
import { API_URL, SOCKET_EVENT } from "./constants/config";
import {
    ChangeLockResponse,
    CreateRoomResponse,
    EndResponse,
    GetRoomListResponse,
    JoinRoomResponse,
} from "./types/transport";

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

    public createRoom(username: string): Promise<CreateRoomResponse> {
        return new Promise((resolve, reject) => {
            if (!this.socket) {
                reject("Socket not initialized");
            } else {
                this.socket.emit(SOCKET_EVENT.CREATE_ROOM, username, "");
                this.socket.on(
                    SOCKET_EVENT.CREATE_ROOM_RESPONSE,
                    (
                        responseStatus: CreateRoomResponse["responseStatus"],
                        roomID: string
                    ) => {
                        resolve({
                            responseStatus,
                            roomID,
                        });
                    }
                );
            }
        });
    }

    public changeLock(): Promise<ChangeLockResponse> {
        return new Promise((resolve, reject) => {
            if (!this.socket) {
                reject("Socket not initialized");
            } else {
                this.socket.emit(SOCKET_EVENT.CHANGE_LOCK, "");
                this.socket.on(
                    SOCKET_EVENT.CHANGE_LOCK_RESPONSE,
                    (responseStatus: ChangeLockResponse["responseStatus"]) => {
                        resolve({
                            responseStatus,
                        });
                    }
                );
            }
        });
    }

    public getRoomList(): Promise<GetRoomListResponse> {
        return new Promise((resolve, reject) => {
            if (!this.socket) {
                reject("Socket not initialized");
            } else {
                this.socket.emit(SOCKET_EVENT.GET_ROOM_LIST);
                this.socket.on(
                    SOCKET_EVENT.GET_ROOM_LIST_RESPONSE,
                    (
                        responseStatus: GetRoomListResponse["responseStatus"],
                        roomList: GetRoomListResponse["roomList"]
                    ) => {
                        resolve({ responseStatus, roomList });
                    }
                );
            }
        });
    }

    // separated this function from joinRoom for createRoom use-case
    public subscribeToRoomJoined(
        callbackFn: (response: JoinRoomResponse) => void
    ) {
        if (this.socket) {
            this.socket.on(
                SOCKET_EVENT.JOIN_ROOM_RESPONSE,
                (
                    responseStatus: JoinRoomResponse["responseStatus"],
                    username: JoinRoomResponse["username"]
                ) => {
                    callbackFn({ responseStatus, username });
                }
            );
        }
    }

    public joinRoom(username: string, roomId: string): Promise<void> {
        return new Promise((resolve, reject) => {
            if (!this.socket) {
                reject("Socket not initialized");
            } else {
                this.socket.emit(SOCKET_EVENT.JOIN_ROOM, username, roomId);
                resolve();
            }
        });
    }

    // separated this function from withdraw
    public subscribeToEndResponse(callbackFn: (response: EndResponse) => void) {
        if (this.socket) {
            this.socket.on(
                SOCKET_EVENT.END_RESPONSE,
                (
                    responseStatus: EndResponse["responseStatus"],
                    previousRoundWinner: EndResponse["previousRoundWinner"],
                    hostScore: EndResponse["hostScore"],
                    guestScore: EndResponse["guestScore"]
                ) => {
                    callbackFn({
                        responseStatus,
                        previousRoundWinner,
                        hostScore,
                        guestScore,
                    });
                }
            );
        }
    }

    public withdraw(): Promise<EndResponse> {
        return new Promise((resolve, reject) => {
            if (!this.socket) {
                reject("Socket not initialized");
            } else {
                this.socket.emit(SOCKET_EVENT.WITHDRAW);
                this.subscribeToEndResponse(resolve);
            }
        });
    }

    public disconnect() {
        if (this.socket) this.socket.disconnect();
    }
}

const socketClient = new SocketClient(); // singleton pattern

export default socketClient;
