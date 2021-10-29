import { Room } from '../../class';
import { Socket } from 'socket.io';
import { randomShoot } from '../../utils/randomShoot';
import { timePerRound } from '../../config';
import { findOpponentSocketId } from '../../utils';

export const setup = (
	socket: Socket,
	roomList: Room[],
	coordinates: string[]
) => {
	// Setup the request owner board and set the player ready
	const room = roomList.find(
		(room) =>
			room.hostSocketID === socket.id || room.guestSocketID === socket.id
	);

	if (room.guestSocketID === socket.id) {
		room.guestShips = coordinates;
		room.guestReady = true;
	} else if (room.hostSocketID === socket.id) {
		room.hostShips = coordinates;
		room.hostReady = true;
	}

	// Notify Both Players of each other Status
	const opponentSocketId = findOpponentSocketId(room, socket.id);
	socket
		.to(opponentSocketId)
		.emit('setupResponse', 'Completed', room.hostReady, room.guestReady);
	socket.emit('setupResponse', 'Completed', room.hostReady, room.guestReady);
	console.log(room);

	// If both players are ready, start the game room and notify both players that the game have started
	if (room.hostReady && room.guestReady) {
		room.guestShot = [];
		room.hostShot = [];

		// Random Starting Player
		const randomInt = Math.floor(Math.random() * 2);
		if (randomInt === 0) room.turn = 'Host';
		else room.turn = 'Guest';

		// Notify both players that the game has started and whose turn it is
		socket
			.to(opponentSocketId)
			.emit('gameStartResponse', 'Completed', room.turn);
		socket.emit('gameStartResponse', 'Completed', room.turn);

		// Set Timer for Autoshoot
		room.timer = setTimeout(() => {
			randomShoot(socket, room);
		}, timePerRound);
	}
};
