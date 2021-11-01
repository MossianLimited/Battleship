export interface Room {
    roomID: string;
    hostUsername: string;
}

export interface GetRoomListResponse {
    responseStatus: "Completed";
    roomList: Room[];
}

export interface CreateRoomResponse {
    responseStatus: "Completed" | "Too Many Connections";
    roomID: string;
}

export interface ChangeLockResponse {
    responseStatus: "Completed";
}

export interface JoinRoomResponse {
    responseStatus:
        | "Completed"
        | "Invalid Room ID"
        | "Invalid Password"
        | "Room Full";
    username: string; // for host = guest username; for guest = host username
}

export interface EndResponse {
    responseStatus: string;
    previousRoundWinner: string;
    hostScore: number;
    guestScore: number;
}
