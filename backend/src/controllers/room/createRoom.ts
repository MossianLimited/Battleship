import { Socket } from 'socket.io';
import { Room } from '../../class';

export const createRoom = (
	socket: Socket,
	username: string,
	roomPass: string,
	roomIterator: number,
	address: string,
	roomList: Room[]
) => {
	console.log(
		`Room creation asked from ${username} with ${address} with room password of ${roomPass}`
	);
	console.log('Creating room...');
	const locked = roomPass ? true : false;
	roomList.push(
		new Room(username, roomPass, socket.id, address, locked, roomIterator)
	);
	console.log(roomList.find((room) => room.hostSocketID === socket.id));
	console.log(roomList.find((room) => room.hostSocketID === socket.id).roomID);
	socket.emit(
		'createRoomResponse',
		'Completed',
		roomList.find((room) => room.hostSocketID === socket.id).roomID
	);
};
