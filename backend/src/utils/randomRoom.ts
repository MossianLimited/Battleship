let roomChosen : Array<Number>;

roomChosen = []

export const randomRoom = () => {
    let randomRoomNum = Math.random() * 999999;
    if (roomChosen.includes(randomRoomNum)) randomRoom();
    else {
        roomChosen.push(randomRoomNum);
        return randomRoomNum;
    }
}