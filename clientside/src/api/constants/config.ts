export const API_URL = "http://localhost:8000";

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