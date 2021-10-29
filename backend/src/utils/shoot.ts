import { Socket } from 'socket.io';
import { Room } from '../class';
import { timePerRound } from '../config';
import { randomShoot } from '.';

export const shoot = (socket: Socket, room: Room, location: string) => {
	// Get Current Turn Player, Update Turn Number, and Logging
	const currentTurn = room.turn;
	room.turnCount += 1;
	console.log('room: ' + room.roomID);

	// Check if guest hits hosts or host hits guest
	if (
		(currentTurn == 'Guest' && room.hostShips.includes(location)) ||
		(currentTurn == 'Host' && room.guestShips.includes(location))
	) {
		// Add Hit Count and Add Shot Location
		console.log(currentTurn + ' hits at ' + location);
		if (currentTurn === 'Guest') {
			room.guestHitCount += 1;
			room.guestShot.push(location);
		} else if (currentTurn === 'Host') {
			room.hostHitCount += 1;
			room.hostShot.push(location);
		}

		// Send Update to Both Players
		socket
			.to(room.hostSocketID)
			.emit(
				'shootResponse',
				'Hit',
				location,
				currentTurn,
				room.turn,
				room.turnCount
			);
		socket
			.to(room.guestSocketID)
			.emit(
				'shootResponse',
				'Hit',
				location,
				currentTurn,
				room.turn,
				room.turnCount
			);
		socket.emit(
			'shootResponse',
			'Hit',
			location,
			currentTurn,
			room.turn,
			room.turnCount
		);

		// Set the new timer for autoshoot after each shot
		room.timer = setTimeout(() => {
			randomShoot(socket, room);
		}, timePerRound);

		// Log Output to server
		console.log(room.hostShot);
		console.log(room.guestShot);
		console.log(room.guestHitCount);
		console.log(room.hostHitCount);
		console.log();
	} else {
		// Swap Player and Add Shot Location
		console.log(currentTurn + ' misses at ' + location);
		if (room.turn === 'Guest') {
			room.turn = 'Host';
			room.guestShot.push(location);
		} else if (room.turn === 'Host') {
			room.turn = 'Guest';
			room.hostShot.push(location);
		}

		// Send Update to Both Players
		socket
			.to(room.hostSocketID)
			.emit(
				'shootResponse',
				'Miss',
				location,
				currentTurn,
				room.turn,
				room.turnCount
			);
		socket
			.to(room.guestSocketID)
			.emit(
				'shootResponse',
				'Miss',
				location,
				currentTurn,
				room.turn,
				room.turnCount
			);
		socket.emit(
			'shootResponse',
			'Miss',
			location,
			currentTurn,
			room.turn,
			room.turnCount
		);

		// Set the new timer for autoshoot after each shot
		room.timer = setTimeout(() => {
			randomShoot(socket, room);
		}, timePerRound);

		// Log Output to server
		console.log(room.hostShot);
		console.log(room.guestShot);
		console.log(room.guestHitCount);
		console.log(room.hostHitCount);
		console.log();
	}

	// Check if any player has won
	if (room.hostHitCount >= 16) {
		// add score to host
		room.hostScore += 1;

		// send to both players who won
		socket
			.to(room.hostSocketID)
			.emit(
				'endResponse',
				'Destroyed',
				'Host',
				room.hostScore,
				room.guestScore
			);
		socket
			.to(room.guestSocketID)
			.emit(
				'endResponse',
				'Destroyed',
				'Host',
				room.hostScore,
				room.guestScore
			);
		socket.emit(
			'endResponse',
			'Destroyed',
			'Host',
			room.hostScore,
			room.guestScore
		);
		// send to both players who won
		room.guestReady = false;
		room.hostReady = false;
		room.guestHitCount = 0;
		room.hostHitCount = 0;
		room.turn = undefined;
		room.hostShips = [];
		room.guestShips = [];
		room.hostShot = [];
		room.guestShot = [];
		room.turnCount = 0;
		clearTimeout(room.timer);
	} else if (room.guestHitCount >= 16) {
		// add score to guest
		room.guestScore += 1;

		// reset room to setup stage
		socket
			.to(room.guestSocketID)
			.emit(
				'endResponse',
				'Destroyed',
				'Guest',
				room.hostScore,
				room.guestScore
			);
		socket
			.to(room.hostSocketID)
			.emit(
				'endResponse',
				'Destroyed',
				'Guest',
				room.hostScore,
				room.guestScore
			);
		socket.emit(
			'endResponse',
			'Destroyed',
			'Guest',
			room.hostScore,
			room.guestScore
		);
		room.guestReady = false;
		room.hostReady = false;
		room.guestHitCount = 0;
		room.hostHitCount = 0;
		room.turn = undefined;
		room.hostShips = [];
		room.guestShips = [];
		room.hostShot = [];
		room.guestShot = [];
		room.turnCount = 0;
		clearTimeout(room.timer);
	}

	// Check if room has admin spectator
	if (room.spectator) {
		socket.to(room.spectator).emit('adminSpectateResponse', room);
	}
};
