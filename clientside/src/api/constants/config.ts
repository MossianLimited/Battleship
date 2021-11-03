// export const API_URL = "localhost:8000";
export const API_URL = "139.59.108.208:42069";

export enum SocketEvent {
    CreateRoom = "createRoom",
    CreateRoomResponse = "createRoomResponse",
    ChangeLock = "changeLock",
    ChangeLockResponse = "changeLockResponse",
    GetRoomList = "getRoomList",
    GetRoomListResponse = "getRoomListResponse",
    JoinRoom = "joinRoom",
    JoinRoomResponse = "joinRoomResponse",
    SetAvatar = "setAvatar",
    SetAvatarResponse = "setAvatarResponse",
    RandomShip = "randomShip", 
    RandomShipResponse = "randomShipResponse", 
    Setup = "setup", 
    SetupResponse = "setupResponse",
    Shoot = "shoot",
    ShootResponse = "shootResponse",
    StartResponse = "gameStartResponse",
    EndResponse = "endResponse",
    ShipDestroyed = "shipDestroyed",
    Chat = "chat", 
    Withdraw = "withdraw",
    SocketId = "SocketID",
    Disconnect = "disconnect",
}

export enum SetupResponseStatus {
    Completed = "Completed",
    InvalidPlacement = "Invalid Placement",
}

export type InfallibleResponse = "Completed";
