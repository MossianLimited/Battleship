import { Socket } from 'socket.io';
import { Room, Admin } from '../../class';
import { checkAdmin } from '../../utils';

export const adminStopSpectate = (
	socket: Socket,
	roomID: string,
	roomList: Room[],
	adminList: Admin[]
) => {
	// Check privilege
	if (checkAdmin(socket.id, adminList)) {
		// Check if the admin is already spectating any game. If yes, unsubscribe admin to the room
		if (adminList.find((admin) => admin.socketID === socket.id).isSpectating) {
			roomList.find((room) => room.roomID == roomID).spectator = undefined;
			socket.emit('adminStopSpectateResponse', 'Completed');
		} else {
			socket.emit('adminStopSpectateResponse', 'Not Spectating');
		}
	} else {
		socket.emit('adminStopSpectateResponse', 'Connection Not Verified');
	}

	roomList.find((room) => room.roomID == roomID).spectator = undefined;
	socket.emit('adminStopSpectateResponse', 'Completed');
};
