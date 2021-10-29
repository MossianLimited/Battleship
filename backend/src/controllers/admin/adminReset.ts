import { Socket } from 'socket.io';
import { Room, Admin } from '../../class';
import { checkAdmin, resetRoom } from '../../utils';

export const adminReset = (
	socket: Socket,
	filterType: string,
	filter: string,
	roomList: Room[],
	adminList: Admin[]
) => {
	// Check privilege
	if (checkAdmin(socket.id, adminList)) {
		// Check if the username is in any rooom
		if (filterType === 'username') {
			// Send response to both clients and Reset all values of the room to before set up
			roomList
				.filter(
					(room) =>
						room.hostUsername === filter || room.guestUsername === filter
				)
				.forEach((room) => {
					socket
						.to(room.hostSocketID)
						.emit(
							'endResponse',
							'Reset by Admin',
							'None',
							room.hostScore,
							room.guestScore
						);
					socket
						.to(room.guestSocketID)
						.emit(
							'endResponse',
							'Reset by Admin',
							'None',
							room.hostScore,
							room.guestScore
						);

					resetRoom(room);
				});

			// Check Using Room ID
		} else if (filterType === 'room ID') {
			// Send response to both clients and Reset all values of the room to before set up
			const room = roomList.find((room) => room.roomID === filter);
			socket
				.to(room.hostSocketID)
				.emit(
					'endResponse',
					'Reset by Admin',
					'None',
					room.hostScore,
					room.guestScore
				);
			socket
				.to(room.guestSocketID)
				.emit(
					'endResponse',
					'Reset by Admin',
					'None',
					room.hostScore,
					room.guestScore
				);

			resetRoom(room);
		}
		socket.emit('adminResetResponse', 'Completed');
	} else {
		socket.emit('adminResetResponse', 'Connection Not Verified');
	}
};
