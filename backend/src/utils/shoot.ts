import { Socket } from 'socket.io';
import { Room } from '../class';
import { timePerRound } from '../config';
import { findOpponentSocketId, randomShoot, resetRoom } from '.';
import { stat } from '../controllers/game/stat';

const checkDestroyed = (
	socket: Socket,
	location: string,
	playerShips: string[][],
	playerShipsCopy: string[][],
	opponentSocketId: string,
	currentTurn: string
) => {
	let shipDestroyed: string;
	if (currentTurn === 'Guest') shipDestroyed = 'Host';
	else shipDestroyed = 'Guest';
	for (let i = 0; i < playerShipsCopy.length; i++) {
		const index = playerShipsCopy[i].findIndex((coordinate) => coordinate === location);
		if (index !== -1) {
			playerShipsCopy[i].splice(index, 1);
			if (playerShipsCopy[i].length === 0) {
				socket.emit('shipDestroyed', shipDestroyed, playerShips[i]);
				socket
					.to(opponentSocketId)
					.emit('shipDestroyed', shipDestroyed, playerShips[i]);
			}
		}
	};
};
export const shoot = (socket: Socket, room: Room, location: string) => {
	// Get Current Turn Player, Update Turn Number, and Logging
	const currentTurn = room.turn;
	const opponentSocketId = findOpponentSocketId(room, socket.id);
	let shootStatus: string;

	room.turnCount += 1;
	console.log('room: ' + room.roomID);

	// Check if guest hits hosts or host hits guest
	if (
		(currentTurn == 'Guest' &&
			room.hostShips.some((ship) => ship.includes(location))) ||
		(currentTurn == 'Host' &&
			room.guestShips.some((ship) => ship.includes(location)))
	) {
		// Add Hit Count and Add Shot Location
		console.log(currentTurn + ' hits at ' + location);
		if (currentTurn === 'Guest') {
			room.guestHitCount += 1;
			room.guestShot.push(location);
			checkDestroyed(
				socket,
				location,
				room.hostShips,
				room.hostShipsCopy,
				opponentSocketId,
				currentTurn
			);
		} else if (currentTurn === 'Host') {
			room.hostHitCount += 1;
			room.hostShot.push(location);
			checkDestroyed(
				socket,
				location,
				room.guestShips,
				room.guestShipsCopy,
				opponentSocketId,
				currentTurn
			);
		}
		shootStatus = 'Hit';
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
		shootStatus = 'Miss';
	}

	// Send Update to Both Players
	socket
		.to(opponentSocketId)
		.emit(
			'shootResponse',
			shootStatus,
			location,
			currentTurn,
			room.turn,
			room.turnCount,
			room.hostHitCount,
			room.guestHitCount
		);
	socket.emit(
		'shootResponse',
		shootStatus,
		location,
		currentTurn,
		room.turn,
		room.turnCount,
		room.hostHitCount,
		room.guestHitCount
	);

	// Log Output to server
	console.log(room.hostShot);
	console.log(room.guestShot);
	console.log(room.guestHitCount);
	console.log(room.hostHitCount);
	console.log();

	// Set the new timer for autoshoot after each shot
	room.timer = setTimeout(() => {
		randomShoot(socket, room);
	}, timePerRound);

	if (room.hostHitCount >= 16 || room.guestHitCount >= 16) {
		const winner = room.hostHitCount >= 16 ? 'Host' : 'Guest';
		// add score to winner
		if (winner === 'Host') room.hostScore += 1;
		else room.guestScore += 1;
		room.lastWin = winner;
		// send to both players who won
		socket
			.to(opponentSocketId)
			.emit(
				'endResponse',
				'Destroyed',
				winner,
				room.hostScore,
				room.guestScore
			);
		socket.emit(
			'endResponse',
			'Destroyed',
			winner,
			room.hostScore,
			room.guestScore
		);

		stat(socket, room)
		// reset room to setup stage
		resetRoom(room);
	}
	// Check if room has admin spectator
	if (room.spectator)
		socket.to(room.spectator).emit('adminSpectateResponse', room);
};
