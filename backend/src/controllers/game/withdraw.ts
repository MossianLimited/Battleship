import { Socket } from 'socket.io';
import { Room } from '../../class';

export const withdraw = (socket: Socket, roomList: Room[]) => {
	// Find room with matching socket id, let the other player wins, delete the room from the room list, and clear timer
	roomList.forEach((room) => {
		if (room.guestReady === true && room.hostReady === true) {
			if (room.guestSocketID === socket.id) {
				room.hostScore += 1;
				socket
					.to(room.hostSocketID)
					.emit(
						'endResponse',
						'Withdrew',
						'Host',
						room.hostScore,
						room.guestScore
					);
				socket.emit(
					'endResponse',
					'Withdrew',
					'Host',
					room.hostScore,
					room.guestScore
				);
				roomList.splice(
					roomList.findIndex((room) => room.guestSocketID === socket.id, 1)
				);
				if (room.timer != undefined) {
					clearTimeout(room.timer);
				}
				console.log('Host Wins');
				console.log(`room ${room.roomID} deleted`);
			} else if (room.hostSocketID === socket.id) {
				room.guestScore += 1;
				socket
					.to(room.guestSocketID)
					.emit(
						'endResponse',
						'Withdrew',
						'Guest',
						room.hostScore,
						room.guestScore
					);
				socket.emit(
					'endResponse',
					'Withdrew',
					'Guest',
					room.hostScore,
					room.guestScore
				);
				roomList.splice(
					roomList.findIndex((room) => room.hostSocketID === socket.id, 1)
				);
				if (room.timer != undefined) {
					clearTimeout(room.timer);
				}
				console.log('Guest Wins');
				console.log(`room ${room.roomID} deleted`);
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
					'Withdrew',
					'None',
					room.hostScore,
					room.guestScore
				);
			socket.emit(
				'endResponse',
				'Withdrew',
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
			if (room.timer != undefined) {
				clearTimeout(room.timer);
			}
			console.log(`room ${room.roomID} deleted`);
		}
	});
};
