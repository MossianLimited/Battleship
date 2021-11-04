import { Socket } from 'socket.io';
import { Room } from '../../class';

export const changeLock = (socket: Socket, roomList: Room[]) => {
	// Create a list and store open rooms with only Host Username and Room ID properties
    const room = roomList.find((room) => room.hostSocketID === socket.id);
	if (room) {
		room.locked = room.locked ? false : true;
		socket.emit('changeLockResponse', 'Completed');
		console.log('Locked: ' + room.locked)
	}
};
