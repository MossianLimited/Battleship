import { io, Socket } from "socket.io-client";
import { API_URL, SOCKET_EVENT } from "./constants/config";
import {
    ChangeLockResponse,
    CreateRoomResponse,
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

    public createRoom(username: string) {
        if (this.socket) {
            this.socket.emit(SOCKET_EVENT.CREATE_ROOM, username, "");
        }
    }

    public subscribeToRoomCreated(
        callbackFn: (response: CreateRoomResponse) => void
    ) {
        if (this.socket) {
            this.socket.on(
                SOCKET_EVENT.CREATE_ROOM_RESPONSE,
                (
                    responseStatus: CreateRoomResponse["responseStatus"],
                    roomID: string
                ) => {
                    callbackFn({
                        responseStatus,
                        roomID,
                    });
                }
            );
        }
    }

    public changeLock() {
        if (this.socket) {
            this.socket.emit(SOCKET_EVENT.CHANGE_LOCK, "");
        }
    }

    public subscribeToLockChanged(
        callbackFn: (response: ChangeLockResponse) => void
    ) {
        if (this.socket) {
            this.socket.on(
                SOCKET_EVENT.CHANGE_LOCK_RESPONSE,
                (responseStatus: ChangeLockResponse["responseStatus"]) => {
                    callbackFn({
                        responseStatus,
                    });
                }
            );
        }
    }

    public getRoomList() {
        if (this.socket) {
            this.socket.emit(SOCKET_EVENT.GET_ROOM_LIST);
        }
    }

    public subscribeToRoomList(
        callbackFn: (response: GetRoomListResponse) => void
    ) {
        if (this.socket) {
            this.socket.on(
                SOCKET_EVENT.GET_ROOM_LIST_RESPONSE,
                (
                    responseStatus: GetRoomListResponse["responseStatus"],
                    roomList: GetRoomListResponse["roomList"]
                ) => {
                    callbackFn({ responseStatus, roomList });
                }
            );
        }
    }

    public joinRoom(username: string, roomId: string) {
        if (this.socket) {
            this.socket.emit(SOCKET_EVENT.JOIN_ROOM, username, roomId, "");
        }
    }

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

    public disconnect() {
        if (this.socket) this.socket.disconnect();
    }
}

const socketClient = new SocketClient(); // singleton pattern

export default socketClient;
