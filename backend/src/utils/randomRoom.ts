let roomChosen : Array<Number>;

roomChosen = []

export const randomRoom = () => {
    let randomRoomNum = Math.floor(Math.random() * 999999);
    if (roomChosen.includes(randomRoomNum)) randomRoom();
    else {
        roomChosen.push(randomRoomNum);
        return randomRoomNum;
    }
}

export const vacateRoom = (roomID: string) => {
    roomChosen.splice(
        roomChosen.findIndex((roomInList) => Number(roomID) === roomInList), 1
    );
}