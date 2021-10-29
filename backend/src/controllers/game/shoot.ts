import { Socket } from 'socket.io';
import { Room } from '../../class';
import { shoot as Shoot } from '../../utils/';
import { validColumns, validRows } from '../../config';

export const shoot = (socket: Socket, roomList: Room[], location: string) => {
	const room = roomList.find(
		(room) =>
			room.hostSocketID === socket.id || room.guestSocketID === socket.id
	);

	// Check if it is a valid shoot command
	if (room.guestSocketID === socket.id) {
		if (room.turn === 'Host') {
			socket.emit('shootResponse', 'Wrong Turn');
			return;
		}
		if (room.guestShot.includes(location)) {
			socket.emit('shootResponse', 'Duplicated Shot');
			return;
		}
	} else if (room.hostSocketID === socket.id) {
		if (room.turn === 'Guest') {
			socket.emit('shootResponse', 'Wrong Turn');
			return;
		}
		if (room.hostShot.includes(location)) {
			socket.emit('shootResponse', 'Duplicated Shot');
			return;
		}
	}
	if (
		!(
			validColumns.includes(location[0]) &&
			validRows.includes(location.substring(1))
		)
	) {
		socket.emit('shootResponse', 'Wrong Location');
		return;
	}
	// If valid, stop autoshoot timer and shoot manually
	clearTimeout(room.timer);
	Shoot(socket, room, location);
	console.log(room);
};
