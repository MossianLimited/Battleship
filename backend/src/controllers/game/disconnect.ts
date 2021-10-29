import { Socket } from 'socket.io';
import { Room, Admin } from '../../class';
import { checkAdmin } from '../../utils';
export const disconnect = (
	socket: Socket,
	roomList: Room[],
	adminList: Admin[]
) => {
	// Find room with matching socket id, let the other player wins, and delete the room from the room list
	console.log(`Client gone [id=${socket.id}]`);
	roomList.forEach((room) => {
		if (room.guestReady === true && room.hostReady === true) {
			if (room.guestSocketID === socket.id) {
				room.hostScore += 1;
				socket
					.to(room.hostSocketID)
					.emit(
						'endResponse',
						'Abandoned',
						'Host',
						room.hostScore,
						room.guestScore
					);
				roomList.splice(
					roomList.findIndex((room) => room.guestSocketID === socket.id, 1)
				);
				console.log('Host Wins');
				console.log(`room ${room.roomID} deleted`);
				if (room.timer != undefined) {
					clearTimeout(room.timer);
				}
			} else if (room.hostSocketID === socket.id) {
				room.guestScore += 1;
				socket
					.to(room.guestSocketID)
					.emit(
						'endResponse',
						'Abandoned',
						'Guest',
						room.hostScore,
						room.guestScore
					);
				roomList.splice(
					roomList.findIndex((room) => room.hostSocketID === socket.id, 1)
				);
				console.log('Guest Wins');
				console.log(`room ${room.roomID} deleted`);
				if (room.timer != undefined) {
					clearTimeout(room.timer);
				}
			}
		} else {
			let opponentSocketId: string;
			if (room.hostSocketID === socket.id)
				opponentSocketId = room.guestSocketID;
			else if (room.guestSocketID === socket.id)
				opponentSocketId = room.hostSocketID;
			socket
				.to(opponentSocketId)
				.emit(
					'endResponse',
					'Abandoned',
					'None',
					room.hostScore,
					room.guestScore
				);
			socket.emit(
				'endResponse',
				'Abandoned',
				'None',
				room.hostScore,
				room.guestScore
			);

			roomList.splice(
				roomList.findIndex(
					(room) =>
						room.hostSocketID === socket.id ||
						room.hostSocketID === opponentSocketId,
					1
				)
			);
			if (room.timer) {
				clearTimeout(room.timer);
			}
			console.log(`room ${room.roomID} deleted`);
		}
	});

	// Check if the socket belongs to admin. If yes, remove the instance from adminList
	if (checkAdmin(socket.id, adminList)) {
		adminList.splice(
			adminList.findIndex((admin) => admin.socketID === socket.id, 1)
		);
		console.log('An admin logs out');
	}
};
