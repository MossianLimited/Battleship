import * as express from "express";
import { Server, Socket } from "socket.io";
import { createServer, Server as ServerType } from "http";
import { Room, Admin, ActiveSocket } from "./class";
import { randomRoom } from "./utils";
import {
    createRoom,
    getRoomList,
    joinRoom,
    changeLock,
} from "./controllers/room";
import {
    setup,
    shoot,
    withdraw,
    disconnect,
    chat,
    randomShip,
    setAvatar
} from "./controllers/game";
import {
    adminClose,
    adminGetRoomID,
    adminGetRoomList,
    adminLogin,
    adminReset,
    adminSpectate,
} from "./controllers/admin";
import { adminStopSpectate } from "./controllers/admin/adminStopSpectate";
const cors = require("cors");
const encrypt = require("socket.io-encrypt");
const useEncryption = false;

export class GameServer {
    public static readonly PORT: number = 8000;
    private _app: express.Application;
    private server: ServerType;
    private io: Server;
    private port: string | number;
    private roomList: Room[];
    private adminList: Admin[];
    private active: ActiveSocket[];

    constructor() {
        this._app = express();
        this.port = GameServer.PORT;
        this._app.use(cors());
        this._app.options("*", cors());
        this.server = createServer(this._app);
        this.roomList = [];
        this.adminList = [];
        this.initSocket();
        this.listen();
        this.active = []
    }

    private initSocket(): void {
        this.io = new Server(this.server, { cors: { origin: "*" } });
        if (useEncryption) this.io.use(encrypt("secretKey"));
    }

    private listen(): void {
        this.server.listen(this.port, () => {
            console.log("Running server on port %s", this.port);
        });

        this.io.on("connection", (socket: Socket) => {
            const address = socket.handshake.address;
            console.log(
                "Connected, socketID: %s, address: %s",
                socket.id,
                address
            );
            socket.emit("SocketID", socket.id);
            this.active.push(new ActiveSocket(socket.id, setInterval( () => socket.emit("heartbeat", this.active.length), 5000)));
            socket.on("getRoomList", () => {
                getRoomList(socket, this.roomList);
            });
            socket.on("createRoom", (username: string) => {
                createRoom(
                    socket,
                    username,
                    randomRoom(),
                    address,
                    this.roomList
                );
            });
            socket.on("joinRoom", (username: string, roomID: string) => {
                joinRoom(socket, username, roomID, address, this.roomList);
            });
            socket.on("changeLock", () => {
                changeLock(socket, this.roomList);
            });
            socket.on("chat", (msg: string) => {
                chat(socket, msg, this.roomList);
            });
            socket.on("setAvatar", (avatar: string) => {
                setAvatar(socket, this.roomList, avatar)
            })
            socket.on("setup", (coordinates: string[][]) => {
                setup(socket, this.roomList, coordinates);
            });
            socket.on(
                "randomShip",
                (numOfShips: number, shipLength: number) => {
                    randomShip(socket, numOfShips, shipLength);
                }
            );
            socket.on("shoot", (location: string) => {
                shoot(socket, this.roomList, location);
            });
            socket.on("withdraw", () => {
                withdraw(socket, this.roomList);
            });
            socket.on("disconnect", () => {
                disconnect(socket, this.roomList, this.adminList);
                if (this.active.find(conn => conn.socketID === socket.id) != undefined)
                    clearInterval(this.active.find(conn => conn.socketID === socket.id).timer);
                this.active.splice(
                    this.active.findIndex(conn => conn.socketID === socket.id), 1
                );
            });
            socket.on("adminLogin", (hashedAdminPass: string) => {
                adminLogin(socket, hashedAdminPass, this.adminList);
            });
            socket.on("adminGetRoomList", () => {
                adminGetRoomList(socket, this.roomList, this.adminList);
            });
            socket.on("adminGetRoomID", (filterType, filter) => {
                adminGetRoomID(
                    socket,
                    filterType,
                    filter,
                    this.roomList,
                    this.adminList
                );
            });
            socket.on("adminClose", (filterType, filter) => {
                adminClose(
                    socket,
                    filterType,
                    filter,
                    this.roomList,
                    this.adminList
                );
            });
            socket.on("adminReset", (filterType, filter) => {
                adminReset(
                    socket,
                    filterType,
                    filter,
                    this.roomList,
                    this.adminList
                );
            });
            socket.on("adminSpectate", (roomID) => {
                adminSpectate(socket, roomID, this.roomList, this.adminList);
            });
            socket.on("adminStopSpectate", (roomID) => {
                adminStopSpectate(
                    socket,
                    roomID,
                    this.roomList,
                    this.adminList
                );
            });
        });
    }
    get app(): express.Application {
        return this._app;
    }
}
