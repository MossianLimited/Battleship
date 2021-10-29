import { Room } from '../class';

export const findOpponentSocketId = (room: Room, socketID: string) => {
	if (room.hostSocketID === socketID) return room.guestSocketID;
	else if (room.guestSocketID === socketID) return room.hostSocketID;
};

export const resetRoom = (room: Room) => {
	room.guestReady = false;
	room.hostReady = false;
	room.guestHitCount = 0;
	room.hostHitCount = 0;
	room.turn = undefined;
	room.hostShips = [];
	room.guestShips = [];
	room.hostShot = [];
	room.guestShot = [];
	room.turnCount = 0;
	if (room.timer) clearTimeout(room.timer);
};
