import { Socket } from "socket.io";
import { Room, openRoom } from "../../class";

export const getRoomList = (socket: Socket, roomList: Room[]) => {
    // Create a list and store open rooms with only Host Username and Room ID properties
    const openRoomList: openRoom[] = [];
    roomList
        .filter((room) => !room.locked && !room.guestSocketID)
        .forEach((room) =>
            openRoomList.push(
                new openRoom(room.hostUsername, room.hostAvatar, room.roomID)
            )
        );
    socket.emit("getRoomListResponse", "Completed", openRoomList);
};
