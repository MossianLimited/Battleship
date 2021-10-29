import { Socket } from 'socket.io';
import { Room } from '../class';
import { validColumns } from '../config';
import { shoot } from '.';

export const randomShoot = (socket: Socket, room: Room) => {
	// Random Location Generator
	const randomColumn = validColumns[Math.floor(Math.random() * 8)];
	const randomRow = Math.floor(Math.random() * 8) + 1;
	const randomLocation = randomColumn + randomRow;

	// Check and Recursively Find New Valid Location
	if (room.turn === 'Guest') {
		if (room.guestShot.includes(randomLocation)) {
			randomShoot(socket, room);
			return;
		}
	} else if (room.turn === 'Host') {
		if (room.hostShot.includes(randomLocation)) {
			randomShoot(socket, room);
			return;
		}
	}

	// Shoot the Valid Location
	shoot(socket, room, randomLocation);
};
