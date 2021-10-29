export class Admin {
	public socketID: string;
	public isSpectating: boolean;
	constructor(socketID: string) {
		this.socketID = socketID;
		this.isSpectating = false;
	}
}
