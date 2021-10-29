import { Socket } from 'socket.io';
import { Room } from '../../class';
import { findOpponentSocketId } from '../../utils';

export const chat = (socket: Socket, msg: string, roomList: Room[]) => {
	const room = roomList.find(
		(room) =>
			room.hostSocketID === socket.id || room.guestSocketID === socket.id
	);
	const opponentSocketId = findOpponentSocketId(room, socket.id);
	socket.to(opponentSocketId).emit('chat', msg);
};
