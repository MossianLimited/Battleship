import { Socket } from 'socket.io';
import { findOpponentSocketId } from '../../utils';
import { Room } from '../../class';

export const withdraw = (socket: Socket, roomList: Room[]) => {
	// Find room with matching socket id, let the other player wins, delete the room from the room list, and clear timer
	roomList.forEach((room) => {
		const opponentSocketId = findOpponentSocketId(room, socket.id);
		let winner: string = 'None';
		if (room.guestReady === true && room.hostReady === true) {
			if (room.guestSocketID === socket.id || room.hostSocketID === socket.id) {
				winner = room.guestSocketID === socket.id ? 'Host' : 'Guest';
				if (room.guestSocketID === socket.id) room.hostScore += 1;
				else room.guestScore += 1;
				console.log(`${winner} Wins`);
			}
		}
		socket
			.to(opponentSocketId)
			.emit('endResponse', 'Withdrew', winner, room.hostScore, room.guestScore);
		socket.emit(
			'endResponse',
			'Withdrew',
			winner,
			room.hostScore,
			room.guestScore
		);

		if (room.timer) clearTimeout(room.timer);
		roomList.splice(
			roomList.findIndex(
				(room) =>
					room.guestSocketID === socket.id || room.hostSocketID === socket.id,
				1
			)
		);
		console.log(`room ${room.roomID} deleted`);
	});
};
