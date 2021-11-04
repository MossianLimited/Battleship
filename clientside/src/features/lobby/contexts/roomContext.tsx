import { createContext, useContext } from "react";
import { Room } from "../../../api/types/transport";

// initializes with empty Product
export const RoomContext = createContext<{
    hoveredRoom?: Room;
    setHoveredRoom: (room?: Room) => void;
}>({
    hoveredRoom: undefined,
    setHoveredRoom: () => {},
});

export const useRoomContext = () => useContext(RoomContext);
