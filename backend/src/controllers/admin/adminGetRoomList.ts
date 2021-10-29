import { Socket } from 'socket.io';
import { Room, Admin } from '../../class';
import { checkAdmin } from '../../utils';

export const adminGetRoomList = (
	socket: Socket,
	roomList: Room[],
	adminList: Admin[]
) => {
	if (checkAdmin(socket.id, adminList))
		socket.emit('adminGetRoomListResponse', 'Completed', roomList);
	else socket.emit('adminGetRoomListResponse', 'Connection Not Verified');
};
