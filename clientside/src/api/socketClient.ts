import { io, Socket } from "socket.io-client";
import {
    API_URL,
    InfallibleResponse,
    SetupResponseStatus,
    SocketEvent,
} from "./constants/config";
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
            this.socket.on(SocketEvent.SocketId, (socketId: string) => {
                console.log("Connected to socket ID:", socketId);
            });
        }
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

    public async changeLock(): Promise<ChangeLockResponse> {
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

    public async getRoomList(): Promise<GetRoomListResponse> {
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

    // separated this function from joinRoom for createRoom use-case
    public subscribeToRoomJoined(
        callbackFn: (response: JoinRoomResponse) => void
    ) {
        if (this.socket) {
            this.socket.on(
                SocketEvent.JoinRoomResponse,
                (
                    responseStatus: JoinRoomResponse["responseStatus"],
                    username: JoinRoomResponse["username"]
                ) => {
                    callbackFn({ responseStatus, username });
                }
            );
        }
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

    // separated this function from withdraw
    public subscribeToEndResponse(callbackFn: (response: EndResponse) => void) {
        if (this.socket) {
            this.socket.on(
                SocketEvent.EndResponse,
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

    public async withdraw(): Promise<EndResponse> {
        return new Promise((resolve, reject) => {
            if (!this.socket) {
                reject("Socket not initialized");
            } else {
                this.socket.emit(SocketEvent.Withdraw);
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
