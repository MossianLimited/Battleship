import { InfallibleResponse } from "../constants/config";

export interface Room {
    roomID: string;
    hostUsername: string;
    hostAvatar: string;
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

export interface AvatarResponse {
    responseStatus: string;
    hostAvatar: string;
    guestAvatar: string;
    hostUsername: string;
    guestUsername: string;
}

export interface StartResponse {
    responseStatus: InfallibleResponse; 
    firstPlayer: string; 
}

export interface EndResponse {
    responseStatus:
        | "Destroyed"
        | "Withdrew"
        | "Abandoned"
        | "Reset by Admin"
        | "Closed by Admin";
    previousRoundWinner: string;
    hostScore: number;
    guestScore: number;
}

export interface ShootResponse {
    responseStatus:
        | "Hit"
        | "Miss"
        | "Wrong Turn"
        | "Duplicated Shot"
        | "Wrong Location";
    location: string; 
    currentTurnPlayer: string; 
    nextTurnPlayer: string; 
    turnCount: number; 
}