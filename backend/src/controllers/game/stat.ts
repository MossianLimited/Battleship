import { Socket } from 'socket.io';
import { Room } from '../../class';
import { findOpponentSocketId } from '../../utils';

export const stat = (socket: Socket, room: Room) => {
	// Create a list and store open rooms with only Host Username and Room ID properties
    const opponentSocketId = findOpponentSocketId(room, socket.id);
    console.log(Date.now() - room.matchStart)

	socket.emit(
        'statResponse',
        'Completed',
        room.hostShot.length,
        room.hostHitCount,
        room.hostShot.length - room.hostHitCount,
        room.hostHitCount/room.hostShot.length * 100,
        room.guestShot.length,
        room.guestHitCount,
        room.guestShot.length - room.guestHitCount,
        room.guestHitCount/room.guestShot.length * 100,
        Date.now() - room.matchStart,
        room.turnCount
    )

    socket.to(opponentSocketId).emit(
        'statResponse',
        'Completed',
        room.hostShot.length,
        room.hostHitCount,
        room.hostShot.length - room.hostHitCount,
        room.hostHitCount/room.hostShot.length * 100,
        room.guestShot.length,
        room.guestHitCount,
        room.guestShot.length - room.guestHitCount,
        room.guestHitCount/room.guestShot.length * 100,
        Date.now() - room.matchStart,
        room.turnCount
    )

};
