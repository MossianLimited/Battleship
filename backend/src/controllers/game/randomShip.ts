import { Socket } from 'socket.io';
import { randomShip as random } from '../../utils/ship';

export const randomShip = (
	socket: Socket,
	numOfShips: number,
	shipLength: number
) => {
	const ships: string[][] = random(numOfShips, shipLength);
	socket.emit('randomShipResponse', 'Completed', ships);
};
