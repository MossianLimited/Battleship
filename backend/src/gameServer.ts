import * as express from 'express';
import { Server, Socket } from 'socket.io';
import { createServer, Server as ServerType } from 'http';
import { Room, Admin } from './class';
import { createRoom, getRoomList, joinRoom } from './controllers/room';
import { setup, shoot, withdraw, disconnect } from './controllers/game';
import {
	adminClose,
	adminGetRoomID,
	adminGetRoomList,
	adminLogin,
	adminReset,
	adminSpectate
} from './controllers/admin';
import { adminStopSpectate } from './controllers/admin/adminStopSpectate';
const cors = require('cors');
const encrypt = require('socket.io-encrypt');
const useEncryption = false;

let roomIterator = 0;

export class GameServer {
	public static readonly PORT: number = 8000;
	private _app: express.Application;
	private server: ServerType;
	private io: Server;
	private port: string | number;
	private roomList: Room[];
	private adminList: Admin[];

	constructor() {
		this._app = express();
		this.port = GameServer.PORT;
		this._app.use(cors());
		this._app.options('*', cors());
		this.server = createServer(this._app);
		this.roomList = [];
		this.adminList = [];
		this.initSocket();
		this.listen();
	}

	private initSocket(): void {
		this.io = new Server(this.server, { cors: { origin: '*' } });
		if (useEncryption) this.io.use(encrypt('secretKey'));
	}

	private listen(): void {
		this.server.listen(this.port, () => {
			console.log('Running server on port %s', this.port);
		});

		this.io.on('connection', (socket: Socket) => {
			const address = socket.handshake.address;
			console.log('Connected, socketID: %s, address: %s', socket.id, address);
			socket.emit('SocketID', socket.id);
			socket.on('getRoomList', () => {
				getRoomList(socket, this.roomList);
			});
			socket.on('createRoom', (username: string, roomPass: string) => {
				createRoom(
					socket,
					username,
					roomPass,
					roomIterator,
					address,
					this.roomList
				);
			});
			socket.on(
				'joinRoom',
				(username: string, roomID: string, roomPass: string) => {
					joinRoom(socket, username, roomID, roomPass, address, this.roomList);
				}
			);
			socket.on('setup', (coordinates: string[]) => {
				setup(socket, this.roomList, coordinates);
			});
			socket.on('shoot', (location: string) => {
				shoot(socket, this.roomList, location);
			});
			socket.on('withdraw', () => {
				withdraw(socket, this.roomList);
			});
			socket.on('disconnect', () => {
				disconnect(socket, this.roomList, this.adminList);
			});
			socket.on('adminLogin', (hashedAdminPass: string) => {
				adminLogin(socket, hashedAdminPass, this.adminList);
			});
			socket.on('adminGetRoomList', () => {
				adminGetRoomList(socket, this.roomList, this.adminList);
			});
			socket.on('adminGetRoomID', (filterType, filter) => {
				adminGetRoomID(
					socket,
					filterType,
					filter,
					this.roomList,
					this.adminList
				);
			});
			socket.on('adminClose', (filterType, filter) => {
				adminClose(socket, filterType, filter, this.roomList, this.adminList);
			});
			socket.on('adminReset', (filterType, filter) => {
				adminReset(socket, filterType, filter, this.roomList, this.adminList);
			});
			socket.on('adminSpectate', (roomID) => {
				adminSpectate(socket, roomID, this.roomList, this.adminList);
			});
			socket.on('adminStopSpectate', (roomID) => {
				adminStopSpectate(socket, roomID, this.roomList, this.adminList);
			});
		});
	}
	get app(): express.Application {
		return this._app;
	}
}
