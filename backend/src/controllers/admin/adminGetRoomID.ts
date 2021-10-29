import { Socket } from 'socket.io';
import { Room, Admin } from '../../class';
import { checkAdmin } from '../../utils';

export const adminGetRoomID = (
	socket: Socket,
	filterType: string,
	filter: string,
	roomList: Room[],
	adminList: Admin[]
) => {
	// Check privilege
	if (checkAdmin(socket.id, adminList)) {
		const roomIDList: string[] = [];
		// Check if the username is in any rooom
		if (filterType === 'username') {
			roomList
				.filter(
					(room) =>
						room.hostUsername === filter || room.guestUsername === filter
				)
				.forEach((room) => {
					roomIDList.push(room.roomID);
				});
		}
		socket.emit('adminGetRoomIDResponse', 'Completed', roomIDList);
	} else socket.emit('adminGetRoomListResponse', 'Connection Not Verified');
};
