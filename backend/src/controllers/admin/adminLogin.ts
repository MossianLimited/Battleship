import { Socket } from 'socket.io';
import { Admin } from '../../class';
import { adminPasswordHashed } from '../../config';

export const adminLogin = (
	socket: Socket,
	hashedAdminPass: string,
	adminList: Admin[]
) => {
	// Check if the admin password is correct
	if (hashedAdminPass === adminPasswordHashed) {
		adminList.push(new Admin(socket.id));
		console.log('An admin logs in');
		socket.emit('adminLoginResponse', 'Completed');
	} else {
		socket.emit('adminLoginResponse', 'Wrong Password');
	}
};
