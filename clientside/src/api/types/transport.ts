import { InfallibleResponse } from "../constants/config";

export interface Room {
    roomID: string;
    hostUsername: string;
    hostAvatar: string;
}

export interface AdminSpectateRoom extends Room {
    guestUsername?: string;
    guestAvatar?: string;
}

export interface AdminRoomObserver {
    roomID: string;
    hostUsername: string;
    guestUsername: string;
    hostScore: number;
    guestScore: number;
    hostHitCount: number;
    guestHitCount: number;
    turnCount: number;
    turn: string;
    guestShips: string[][];
    hostShips: string[][];
    guestShot: string[];
    hostShot: string[];
    hostAvatar: string;
    guestAvatar: string;
}

export interface GetRoomListResponse {
    responseStatus: "Completed";
    roomList: Room[];
}

export interface AdminGetRoomListResponse {
    responseStatus: "Completed" | "Connection Not Verified";
    roomList: AdminSpectateRoom[];
}

export interface AdminSpectateResponse {
    responseStatus:
        | "Completed"
        | "Connection Not Verified"
        | "Already Watching";
    room: AdminRoomObserver;
}

export interface AdminStopSpectateResponse {
    responseStatus:
        | "Completed"
        | "Connection Not Verified"
        | "Already Watching";
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

export interface ShipDestroyedResponse {
    side: "Host" | "Guest";
    ship: string[];
}

export interface Stats {
    total: number;
    hit: number;
    miss: number;
    acc: number;
}

export interface StatResponse {
    responseStatus: InfallibleResponse;
    host: Stats;
    guest: Stats;
    time: number;
    turnCount: number;
}

export interface AdminLoginResponse {
    responseStatus: "Completed" | "Wrong Password";
}
