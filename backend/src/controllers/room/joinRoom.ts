import { Room } from '../../class';
import { Socket } from 'socket.io';

export const joinRoom = (
	socket: Socket,
	username: string,
	roomID: string,
	roomPass: string,
	address: string,
	roomList: Room[]
) => {
	console.log(
		`Room join permission asked from ${username} with ${address} with room id of ${roomID}`
	);

	const room = roomList.find((room) => room.roomID === roomID);
	if (room) {
		if (roomPass === room.hashedRoomPass) {
			// Check if room is full. If not, send joinRoomResponse to both Host and Guest to let they know each other's name
			if (!room.guestUsername) {
				room.guestUsername = username;
				room.guestSocketID = socket.id;
				room.guestIP = address;
				socket.emit('joinRoomResponse', 'Completed', room.hostUsername);
				socket
					.to(room.hostSocketID)
					.emit('joinRoomResponse', 'Completed', room.guestUsername);
				console.log(room);
			} else socket.emit('joinRoomResponse', 'Room Full');
		} else socket.emit('joinRoomResponse', 'Invalid Password');
	} else socket.emit('joinRoomResponse', 'Invalid Room ID');
};
