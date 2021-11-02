export class ActiveSocket {
    public socketID: string;
    public timer: NodeJS.Timer;
    constructor(socketID: string, timer: NodeJS.Timer) {
		this.socketID = socketID;
		this.timer = timer;
	}
}