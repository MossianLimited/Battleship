import { Socket } from 'socket.io';
import { Room, Admin } from '../../class';
import { checkAdmin } from '../../utils';

export const adminClose = (
	socket: Socket,
	filterType: string,
	filter: string,
	roomList: Room[],
	adminList: Admin[]
) => {
	if (checkAdmin(socket.id, adminList)) {
		// Check if the username is in any rooom
		if (filterType === 'username') {
			// Delete all rooms that matches and remove it from the room list
			roomList
				.filter(
					(room) =>
						room.hostUsername === filter || room.guestUsername === filter
				)
				.forEach((room) => {
					const roomID = room.roomID;
					socket
						.to(room.hostSocketID)
						.emit(
							'endResponse',
							'Closed by Admin',
							'None',
							room.hostScore,
							room.guestScore
						);
					socket
						.to(room.guestSocketID)
						.emit(
							'endResponse',
							'Closed by Admin',
							'None',
							room.hostScore,
							room.guestScore
						);

					console.log(`room ${room.roomID} deleted`);
					if (room.timer) clearTimeout(room.timer);

					roomList.splice(
						roomList.findIndex((room) => room.roomID === roomID, 1)
					);
				});

			// Check Using Room ID
		} else if (filterType === 'room ID') {
			// Delete all rooms that matches and remove it from the room list
			const room = roomList.find((room) => room.roomID === filter);
			socket
				.to(room.hostSocketID)
				.emit(
					'endResponse',
					'Closed by Admin',
					'None',
					room.hostScore,
					room.guestScore
				);
			socket
				.to(room.guestSocketID)
				.emit(
					'endResponse',
					'Closed by Admin',
					'None',
					room.hostScore,
					room.guestScore
				);

			console.log(`room ${room.roomID} deleted`);
			if (room.timer) clearTimeout(room.timer);
			roomList.splice(roomList.findIndex((room) => room.roomID === filter), 1);
		}
		socket.emit('adminCloseResponse', 'Completed');
	} else {
		socket.emit('adminCloseResponse', 'Connection Not Verified');
	}
};
