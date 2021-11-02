export const API_URL = "http://localhost:8000";

export const SOCKET_EVENT = {
    CREATE_ROOM: "createRoom",
    CREATE_ROOM_RESPONSE: "createRoomResponse",
    CHANGE_LOCK: "changeLock",
    CHANGE_LOCK_RESPONSE: "changeLockResponse",
    GET_ROOM_LIST: "getRoomList",
    GET_ROOM_LIST_RESPONSE: "getRoomListResponse",
    JOIN_ROOM: "joinRoom",
    JOIN_ROOM_RESPONSE: "joinRoomResponse",
    WITHDRAW: "withdraw",
    END_RESPONSE: "endResponse",
    SOCKET_ID: "SocketID",
    DISCONNECT: "disconnect",
};

export enum SocketEvent {
    CreateRoom = "createRoom", 
    CreateRoomResponse = "createRoomResponse",
    ChangeLock = "changeLock",
    ChangeLockResponse = "changeLockResponse",
    GetRoomList = "getRoomList",
    GetRoomListResponse = "getRoomListResponse",
    JoinRoom = "joinRoom",
    JoinRoomResponse = "joinRoomResponse",
    RandomShip = "randomShip", 
    RandomShipResponse = "randomShipResponse", 
    Setup = "setup", 
    SetupResponse = "setupResponse", 
    Withdraw = "withdraw",
    EndResponse = "endResponse",
    SocketId = "SocketID",
    Disconnect = "disconnect",
}

export enum SetupResponseStatus {
    Completed = "Completed", 
    InvalidPlacement = "Invalid Placement"
}

export type InfallibleResponse = 'Completed'; 