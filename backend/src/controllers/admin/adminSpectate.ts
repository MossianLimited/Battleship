import { Socket } from 'socket.io';
import { Room, Admin } from '../../class';
import { checkAdmin } from '../../utils';

export const adminSpectate = (
	socket: Socket,
	roomID: string,
	roomList: Room[],
	adminList: Admin[]
) => {
	// Check privilege
	if (checkAdmin(socket.id, adminList)) {
		// Check if the admin is already spectating any game. If not, subscribe admin to the room
		if (adminList.find((admin) => admin.socketID === socket.id).isSpectating) {
			socket.emit('adminSpectateResponse', 'Already Spectating');
		} else {
			roomList.find((room) => room.roomID == roomID).spectator = socket.id;
		}
	} else {
		socket.emit('adminSpectateResponse', 'Connection Not Verified');
	}
};
