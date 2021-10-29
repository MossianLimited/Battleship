import { Socket } from 'socket.io';
import { Room, Admin } from '../../class';
import { checkAdmin, findOpponentSocketId } from '../../utils';
export const disconnect = (
	socket: Socket,
	roomList: Room[],
	adminList: Admin[]
) => {
	// Find room with matching socket id, let the other player wins, and delete the room from the room list
	console.log(`Client gone [id=${socket.id}]`);
	roomList.forEach((room) => {
		const opponentSocketId = findOpponentSocketId(room, socket.id);
		let winner: string = 'None';
		if (room.guestReady === true && room.hostReady === true) {
			winner = room.guestSocketID === socket.id ? 'Host' : 'Guest';
			if (room.guestSocketID === socket.id) room.hostScore += 1;
			else room.guestScore += 1;
			console.log(`${winner} Wins`);
		}
		socket
			.to(opponentSocketId)
			.emit(
				'endResponse',
				'Abandoned',
				winner,
				room.hostScore,
				room.guestScore
			);
		socket.emit(
			'endResponse',
			'Abandoned',
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

	// Check if the socket belongs to admin. If yes, remove the instance from adminList
	if (checkAdmin(socket.id, adminList)) {
		adminList.splice(
			adminList.findIndex((admin) => admin.socketID === socket.id, 1)
		);
		console.log('An admin logs out');
	}
};
