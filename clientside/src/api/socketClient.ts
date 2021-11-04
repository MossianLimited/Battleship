import { io, Socket } from "socket.io-client";
import {
    API_URL,
    InfallibleResponse,
    SetupResponseStatus,
    SocketEvent,
} from "./constants/config";
import {
    AdminGetRoomListResponse,
    AdminLoginResponse,
    AdminRoomObserver,
    AdminSpectateResponse,
    AdminSpectateRoom,
    AvatarResponse,
    ChangeLockResponse,
    CreateRoomResponse,
    EndResponse,
    GetRoomListResponse,
    JoinRoomResponse,
    ShipDestroyedResponse,
    ShootResponse,
    StartResponse,
    StatResponse,
} from "./types/transport";

class SocketClient {
    private socket?: Socket;

    constructor() {
        this.socket = io(API_URL!);
    }

    public disconnect() {
        if (this.socket) this.socket.disconnect();
    }

    ////////////////////////////
    // Asynchronous Setup API //
    ////////////////////////////

    public async getRooms(): Promise<GetRoomListResponse> {
        return new Promise((resolve, reject) => {
            if (!this.socket) {
                reject("Socket not initialized");
            } else {
                this.socket.emit(SocketEvent.GetRoomList);
                this.socket.on(
                    SocketEvent.GetRoomListResponse,
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

    public async adminGetRooms(): Promise<AdminGetRoomListResponse> {
        return new Promise((resolve, reject) => {
            if (!this.socket) {
                reject("Socket not initialized");
            } else {
                this.socket.emit(SocketEvent.AdminGetRoomList);
                this.socket.on(
                    SocketEvent.AdminGetRoomListResponse,
                    (
                        responseStatus: AdminGetRoomListResponse["responseStatus"],
                        roomList: AdminGetRoomListResponse["roomList"]
                    ) => {
                        resolve({ responseStatus, roomList });
                    }
                );
            }
        });
    }

    public async createRoom(username: string): Promise<CreateRoomResponse> {
        return new Promise((resolve, reject) => {
            if (!this.socket) {
                reject("Socket not initialized");
            } else {
                this.socket.emit(SocketEvent.CreateRoom, username, "");
                this.socket.on(
                    SocketEvent.CreateRoomResponse,
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

    public async joinRoom(username: string, roomId: string): Promise<void> {
        return new Promise((resolve, reject) => {
            if (!this.socket) {
                reject("Socket not initialized");
            } else {
                this.socket.emit(SocketEvent.JoinRoom, username, roomId);
                resolve();
            }
        });
    }

    public async toggleLock(): Promise<ChangeLockResponse> {
        return new Promise((resolve, reject) => {
            if (!this.socket) {
                reject("Socket not initialized");
            } else {
                this.socket.emit(SocketEvent.ChangeLock, "");
                this.socket.on(
                    SocketEvent.ChangeLockResponse,
                    (responseStatus: ChangeLockResponse["responseStatus"]) => {
                        resolve({
                            responseStatus,
                        });
                    }
                );
            }
        });
    }

    public async setAvatar(avatarSeed: string): Promise<void> {
        return new Promise((resolve, reject) => {
            if (!this.socket) {
                reject("Socket not initialized");
            } else {
                this.socket.emit(SocketEvent.SetAvatar, avatarSeed);
                resolve();
            }
        });
    }

    public async waitReady(): Promise<void> {
        return new Promise((resolve, reject) => {
            if (!this.socket) return reject("Socket not initialized");

            // TODO: Heartbeating
            // let intervalId: NodeJS.Timeout | null = null;

            this.socket.on(
                SocketEvent.SetupResponse,
                (
                    status: SetupResponseStatus,
                    hostReady: boolean,
                    guestReady: boolean
                ) => {
                    // intervalId && clearInterval(intervalId);
                    // intervalId = setTimeout(() => {
                    //     reject("Connection timeout 30s.");
                    // }, 30000);

                    if (status === SetupResponseStatus.Completed)
                        hostReady && guestReady && resolve();
                }
            );

            // intervalId = setTimeout(() => {
            //     reject("Connection timeout 30s.");
            // }, 30000);
        });
    }

    public async sendChat(message: string): Promise<void> {
        return new Promise((resolve, reject) => {
            if (!this.socket) {
                reject("Socket not initialized");
            } else {
                this.socket.emit(SocketEvent.Chat, message);
                resolve();
            }
        });
    }

    public async adminLogin(password: string): Promise<void> {
        return new Promise((resolve, reject) => {
            if (!this.socket) {
                reject("Socket not initialized");
            } else {
                this.socket.emit(SocketEvent.AdminLogin, password);
                this.socket.on(
                    SocketEvent.AdminLoginResponse,
                    (responseStatus: AdminLoginResponse["responseStatus"]) => {
                        if (responseStatus === "Completed") {
                            resolve();
                        } else {
                            reject(responseStatus);
                        }
                    }
                );
            }
        });
    }

    ///////////////////////////
    // Asynchronous Game API //
    ///////////////////////////

    public async randomize(
        nums: number,
        length: number,
        retry: number,
        fallback: string[][] = [
            ["A1", "A2", "A3", "A4"],
            ["C2", "D2", "E2", "F2"],
            ["C4", "C5", "C6", "C7"],
            ["H1", "H2", "H3", "H4"],
        ]
    ): Promise<string[][]> {
        if (!this.socket) throw new Error("Socket not initialized");

        let handler = (reason: string) =>
            new Promise<string[][]>((resolve, reject) => {
                if (reason === "Connection timeout 30s.")
                    reject("Connection timeout 30s");

                this.socket?.emit(SocketEvent.RandomShip, nums, length);
                this.socket?.on(
                    SocketEvent.RandomShipResponse,
                    (_: InfallibleResponse, ships: string[][]) => {
                        if (ships.length !== length)
                            reject(
                                "Backend returns empty placements. Retrying..."
                            );

                        resolve(ships);
                    }
                );

                setTimeout(() => {
                    reject("Connection timeout 30s.");
                }, 3000);
            });

        let promise = handler("");

        for (let i = 0; i < retry; i++) promise = promise.catch(handler);

        return promise.catch((_) => fallback);
    }

    public async setup(ships: string[][]): Promise<[boolean, boolean]> {
        return new Promise((resolve, reject) => {
            if (!this.socket) return reject("Socket not initialized");

            this.socket.emit(SocketEvent.Setup, ships);
            this.socket.on(
                SocketEvent.SetupResponse,
                (
                    status: SetupResponseStatus,
                    hostReady: boolean,
                    guestReady: boolean
                ) => {
                    switch (status) {
                        case SetupResponseStatus.Completed:
                            return resolve([hostReady, guestReady]);
                        case SetupResponseStatus.InvalidPlacement:
                            return reject("Invalid placements.");
                    }
                }
            );

            setTimeout(() => {
                reject("Connection timeout 30s.");
            }, 3000);
        });
    }

    public async shoot(pos: string): Promise<ShootResponse> {
        return new Promise((resolve, reject) => {
            if (!this.socket) {
                reject("Socket not initialized.");
            } else {
                this.socket.emit(SocketEvent.Shoot, pos);
                this.subscribeShootResponse(resolve);
            }
        });
    }

    public async withdraw(): Promise<EndResponse> {
        return new Promise((resolve, reject) => {
            if (!this.socket) {
                reject("Socket not initialized");
            } else {
                this.socket.emit(SocketEvent.Withdraw);
                // this.subscribeEndResponse(resolve);
            }
        });
    }

    ////////////////////
    // Subscriber API //
    ////////////////////

    public subscribeAdminSpectate(
        callback: (res: AdminSpectateResponse) => void
    ): void {
        if (!this.socket) return;
        this.socket.on(
            SocketEvent.AdminSpectate,
            (
                responseStatus: AdminSpectateResponse["responseStatus"],
                room: AdminRoomObserver
            ) => {
                callback({
                    responseStatus,
                    room,
                });
            }
        );
    }

    public subscribeShipDestroyed(
        callback: (res: ShipDestroyedResponse) => void
    ) {
        if (!this.socket) return;
        this.socket.on(
            SocketEvent.ShipDestroyed,
            (
                side: ShipDestroyedResponse["side"],
                ship: ShipDestroyedResponse["ship"]
            ) => {
                callback({ side, ship });
            }
        );
    }

    public subscribeJoinResponse(callback: (res: JoinRoomResponse) => void) {
        if (this.socket) {
            this.socket.on(
                SocketEvent.JoinRoomResponse,
                (
                    responseStatus: JoinRoomResponse["responseStatus"],
                    username: JoinRoomResponse["username"]
                ) => {
                    callback({ responseStatus, username });
                }
            );
        }
    }

    public subscribeStartResponse(callback: (res: StartResponse) => void) {
        if (!this.socket) return;
        this.socket.on(
            SocketEvent.StartResponse,
            (
                responseStatus: StartResponse["responseStatus"],
                firstPlayer: StartResponse["firstPlayer"]
            ) => {
                callback({
                    responseStatus,
                    firstPlayer,
                });
            }
        );
    }

    public subscribeEndResponse(callback: (res: EndResponse) => void) {
        if (!this.socket) return;
        this.socket.on(
            SocketEvent.EndResponse,
            (
                responseStatus: EndResponse["responseStatus"],
                previousRoundWinner: EndResponse["previousRoundWinner"],
                hostScore: EndResponse["hostScore"],
                guestScore: EndResponse["guestScore"]
            ) => {
                callback &&
                    callback({
                        responseStatus,
                        previousRoundWinner,
                        hostScore,
                        guestScore,
                    });
            }
        );
    }

    public subscribeShootResponse(callback: (res: ShootResponse) => void) {
        if (!this.socket) return;
        this.socket.on(
            SocketEvent.ShootResponse,
            (
                responseStatus: ShootResponse["responseStatus"],
                location: ShootResponse["location"],
                currentTurnPlayer: ShootResponse["currentTurnPlayer"],
                nextTurnPlayer: ShootResponse["nextTurnPlayer"],
                turnCount: ShootResponse["turnCount"]
            ) => {
                callback({
                    responseStatus,
                    location,
                    currentTurnPlayer,
                    nextTurnPlayer,
                    turnCount,
                });
            }
        );
    }

    public subscribeAvatarResponse(callback: (res: AvatarResponse) => void) {
        if (!this.socket) return;
        this.socket.on(
            SocketEvent.SetAvatarResponse,
            (
                responseStatus: AvatarResponse["responseStatus"],
                hostUsername: AvatarResponse["hostUsername"],
                hostAvatar: AvatarResponse["hostAvatar"],
                guestUsername: AvatarResponse["guestUsername"],
                guestAvatar: AvatarResponse["guestAvatar"]
            ) => {
                callback({
                    responseStatus,
                    hostAvatar,
                    guestAvatar,
                    hostUsername,
                    guestUsername,
                });
            }
        );
    }

    public subscribeChat(callback: (msg: string) => void) {
        if (!this.socket) return;
        this.socket.on(SocketEvent.Chat, (msg: string) => {
            callback(msg);
        });
    }

    public subscribeStatistic(callback: (res: StatResponse) => void) {
        if (!this.socket) return;
        this.socket.on(
            SocketEvent.StatResponse,
            (
                responseStatus: InfallibleResponse,
                hostTotal: number,
                hostHit: number,
                hostMiss: number,
                hostAcc: number,
                guestTotal: number,
                guestHit: number,
                guestMiss: number,
                guestAcc: number,
                time: number,
                turnCount: number
            ) => {
                callback({
                    responseStatus,
                    time,
                    turnCount,
                    host: {
                        total: hostTotal,
                        hit: hostHit,
                        miss: hostMiss,
                        acc: hostAcc,
                    },
                    guest: {
                        total: guestTotal,
                        hit: guestHit,
                        miss: guestMiss,
                        acc: guestAcc,
                    },
                });
            }
        );
    }
}

const socket = new SocketClient(); // singleton pattern

export default socket;
