import { Socket } from 'socket.io';
import { Room, allRoom, Admin } from '../../class';
import { checkAdmin } from '../../utils';

export const adminGetRoomList = (
	socket: Socket,
	roomList: Room[],
	adminList: Admin[]
) => {
	if (checkAdmin(socket.id, adminList)) {
		const allRoomList: allRoom[] = [];
		roomList
			.forEach((room) =>
				allRoomList.push(new allRoom(room.hostUsername, room.guestUsername, room.roomID))
			);
		socket.emit('adminGetRoomListResponse', 'Completed', allRoomList);
	} else socket.emit('adminGetRoomListResponse', 'Connection Not Verified', '');
};
