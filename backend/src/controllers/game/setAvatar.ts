import { Room } from "../../class";
import { Socket } from "socket.io";
import { findOpponentSocketId } from "../../utils";

export const setAvatar = (socket: Socket, roomList: Room[], avatar: string) => {
    // Setup the request owner board and set the player avatar
    const room = roomList.find(
        (room) =>
            room.hostSocketID === socket.id || room.guestSocketID === socket.id
    );

    if (room.guestSocketID === socket.id) room.guestAvatar = avatar;
    else if (room.hostSocketID === socket.id) room.hostAvatar = avatar;

    // Notify Both Players of each other Avatar
    let hostAvatar = room.hostAvatar ? room.hostAvatar : "Not set";
    let guestAvatar = room.guestAvatar ? room.guestAvatar : "Not set";
    const opponentSocketId = findOpponentSocketId(room, socket.id);
    socket
        .to(opponentSocketId)
        .emit(
            "setAvatarResponse",
            "Completed",
            room.hostUsername,
            hostAvatar,
            room.guestUsername ? room.guestUsername : "Not set",
            guestAvatar
        );
    socket.emit(
        "setAvatarResponse",
        "Completed",
        room.hostUsername,
        hostAvatar,
        room.guestUsername ? room.guestUsername : "Not set",
        guestAvatar
    );
    console.log(room);
};
