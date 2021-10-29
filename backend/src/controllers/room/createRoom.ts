import { Socket } from 'socket.io';
import { Room } from '../../class';

export const createRoom = (
	socket: Socket,
	username: string,
	roomIterator: number,
	address: string,
	roomList: Room[]
) => {
	console.log(
		`Room creation asked from ${username} with ${address}`
	);
	console.log('Creating room...');
	roomList.push(
		new Room(username, socket.id, address, roomIterator)
	);
	console.log(roomList.find((room) => room.hostSocketID === socket.id));
	console.log(roomList.find((room) => room.hostSocketID === socket.id).roomID);
	socket.emit(
		'createRoomResponse',
		'Completed',
		roomList.find((room) => room.hostSocketID === socket.id).roomID
	);
};
