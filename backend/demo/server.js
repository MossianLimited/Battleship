const {Server} = require("socket.io");
const server = new Server(8000);
const encrypt = require('socket.io-encrypt');

// AES encryption
server.use(encrypt("secretKey"));

// Global Variables
const validColumns = ["A", "B", "C", "D", "E", "F", "G", "H"];
var roomIterator = 0;
const roomList = [];
const timePerRound = 10000;


// Random Shoot Function
function randomShoot(socket, room) {

    // Random Location Generator
    randomColumn = validColumns[Math.floor(Math.random() * 8)];
    randomRow = Math.floor(Math.random() * 8) + 1;
    randomLocation = randomColumn + randomRow;

    // Check and Recursively Find New Valid Location
    if (room.turn === "Guest") {
        if (room.guestShot.includes(randomLocation)) {
            randomShoot(socket, room);
            return;
        } 
    } else if (room.turn === "Host"){
        if (room.hostShot.includes(randomLocation)) {
            randomShoot(socket, room);
            return;
        }
    }

    // Shoot the Valid Location
    shoot(socket, room, randomLocation);
}
    
// Shoot Function
function shoot(socket, room, location) {
    
    // Get Current Turn Player, Update Turn Number, and Logging
    currentTurn = room.turn;
    room.turnCount += 1;
    console.log("room: " + room.roomID);

    // Check if guest hits hosts or host hits guest
    if (currentTurn == "Guest" && room.hostShips.includes(location) || currentTurn == "Host" && room.guestShips.includes(location)) {
        
        // Add Score and Add Shot Location
        console.log(currentTurn + " hits at " + location);
        if (currentTurn === "Guest") {
            room.guestScore += 1;
            room.guestShot.push(location);
        } else if (currentTurn === "Host") {
            room.hostScore += 1;
            room.hostShot.push(location);
        }

        // Send Update to Both Players 
        socket.to(room.hostSocketID).emit("shootResponse", "Hit", location, currentTurn, room.turn, room.hostScore, room.guestScore, room.turnCount);
        socket.to(room.guestSocketID).emit("shootResponse", "Hit", location, currentTurn, room.turn, room.hostScore, room.guestScore, room.turnCount);
        socket.emit("shootResponse", "Hit", location, currentTurn, room.turn, room.hostScore, room.guestScore, room.turnCount);    

    } else {

        // Swap Player and Add Shot Location
        console.log(currentTurn + " misses at " + location);
        if (room.turn === "Guest") {
            room.turn = "Host";
            room.guestShot.push(location);
        } else if (room.turn === "Host") {
            room.turn = "Guest";
            room.hostShot.push(location);
        }

        // Send Update to Both Players 
        socket.to(room.hostSocketID).emit("shootResponse", "Miss", location, currentTurn, room.turn, room.hostScore, room.guestScore, room.turnCount);
        socket.to(room.guestSocketID).emit("shootResponse", "Miss", location, currentTurn, room.turn, room.hostScore, room.guestScore, room.turnCount);
        socket.emit("shootResponse", "Miss", location, currentTurn, room.turn, room.hostScore, room.guestScore, room.turnCount);
    
    }

    // Check if any player has won
    if (room.hostScore >= 16) {

        socket.to(room.hostSocketID).emit("endResponse", "Destroyed", "Host");
        socket.to(room.guestSocketID).emit("endResponse", "Destroyed", "Host");
        socket.emit("endResponse", "Destroyed", "Host");
        roomList.splice(roomList.findIndex(room => room.guestSocketID === socket.id, 1));
        console.log("Host Wins");
        console.log(`room ${room.roomID} deleted`);
        if (room.timer != undefined) {
            clearTimeout(room.timer);
            return;
        }
        
    } else if (room.guestScore >= 16) {

        socket.to(room.guestSocketID).emit("endResponse", "Destroyed", "Guest");
        socket.to(room.hostSocketID).emit("endResponse", "Destroyed", "Guest");
        socket.emit("endResponse", "Destroyed", "Guest");
        roomList.splice(roomList.findIndex(room => room.hostSocketID === socket.id, 1));
        console.log("Guest Wins");
        console.log(`room ${room.roomID} deleted`);
        if (room.timer != undefined) {
            clearTimeout(room.timer);
            return;
        }
        
    }

    
    // Log Output to server
    console.log(room.hostShot);
    console.log(room.guestShot);
    console.log(room.guestScore);
    console.log(room.hostScore);
    console.log();
    if (room.timer != undefined) {clearTimeout(room.timer)}


    // Check if room has admin spectator
    if (room.spectator != undefined) {
        socket.to(room.spectator).emit("adminWatchResponse", room);
    }
    

    // Set the new timer for autoshoot after each shot
    room.timer = setTimeout(() => {
                    randomShoot(socket, room)
                }, timePerRound)
    

} 
// Room Class
class Room {
    constructor(hostUsername, hashedRoomPass, hostSocketID, hostIP, locked) {

        this.roomID = (("000000" + roomIterator).slice(-6));
        this.locked = locked;
        this.hashedRoomPass = hashedRoomPass;
        this.hostUsername = hostUsername;
        this.hostSocketID = hostSocketID;
        this.hostIP = hostIP;
        this.guestUsername = undefined;
        this.guestSocketID = undefined;
        this.guestIP = undefined;
        this.hostReady = false;
        this.guestReady = false;
        this.hostScore = 0;
        this.guestScore = 0;
        this.turnCount = 1;

        
        roomIterator += 1;
        if (roomIterator >= 1000000) roomIterator = 0;
    }

    
}

// Open Connection
server.on("connection", (socket) => {

    // get Address of Client
    var address = socket.handshake.address;

    // send socketID for debugging
    console.info(`Client connected [id=${socket.id}]`);
    socket.emit("SocketID", socket.id);

/////////////////////////////////////////// CLIENT OPERATION ////////////////////////////////////////////


// OpenRoom Class for Open Guest
class openRoom {
    constructor(name, roomID) {

        this.hostName = name;
        this.roomID = roomID;

    }
}

// Response for getRoomList
socket.on("getRoomList", () => {

    // Create a list and store open rooms with only Host Username and Room ID properties
    openRoomList = [];
    for (room in roomList.filter(room => room.locked === false)) {
        openRoomList.push(new openRoom(room.hostUsername, room.roomID));
    };
    socket.emit("getRoomListResponse", "Completed", openRoomList);
})


// Response to createRoom 
socket.on("createRoom", (username, roomPass) => {

    // Logging
    console.log(`Room creation asked from ${username} with ${address} with room password of ${roomPass}`);
    console.log("Creating room...");

    // Check if the Room should be Public
    if (roomPass === "") {
        locked = false;
    } else {
        locked = true;
    }

    // Add the Room to the List and Send back room ID to Host
    roomList.push(new Room(username, roomPass, socket.id, address, locked));
    console.log(roomList.find(room => room.hostSocketID === socket.id));
    socket.emit("createRoomResponse", "Complete", roomList.find(room => room.hostSocketID === socket.id).roomID)


})


// Response to joinRoom
socket.on("joinRoom", (username, roomID, roomPass) => {

    // Logging
    console.log(`Room join permission asked from ${username} with ${address} with room id of ${roomID}`);


    room = roomList.find(room => room.roomID === roomID);

    // Check if Room Exists
    if (room != undefined) {

        // Check if Password is correct
        if (roomPass === room.hashedRoomPass) {

            // Check if room is full. If not, send joinRoomResponse to both Host and Guest to let they know each other's name
            if (room.guestUsername === undefined) {

                room.guestUsername = username;
                room.guestSocketID = socket.id;
                room.guestIP = address;
                socket.emit("joinRoomResponse", "Complete", room.hostUsername);
                socket.to(room.hostSocketID).emit("joinRoomResponse", "Complete", room.guestUsername);
                console.log(room);

            } else {

                socket.emit("joinRoomResponse", "Room Full")

            }        
        } else socket.emit("joinRoomResponse", "Invalid Password")

    } else socket.emit("joinRoomResponse", "Invalid Room ID")


})


// Response to board setup
socket.on("setup", (cooridinates) => {

    // Setup the request owner board and set the player ready
    room = roomList.find(room => room.hostSocketID === socket.id || room.guestSocketID === socket.id);

    if (room.guestSocketID === socket.id) {
                
        room.guestShips = cooridinates;
        room.guestReady = true;
    
    } else if (room.hostSocketID === socket.id) {
    
        room.hostShips = cooridinates;
        room.hostReady = true;    
    
    }
    
    // Notify Both Players of each other Status
    socket.to(room.hostSocketID).emit("setupResponse", "Complete", room.hostReady, room.guestReady);
    socket.to(room.guestSocketID).emit("setupResponse", "Complete", room.hostReady, room.guestReady);
    socket.emit("setupResponse", "Complete", room.hostReady, room.guestReady);
    console.log(room);
    
    // If both players are ready, start the game room and notify both players that the game have started
    if (room.hostReady && room.guestReady) {

        room.guestShot = [];
        room.hostShot = [];

        // Random Starting Player
        randomInt = Math.floor(Math.random() * 2);
        if (randomInt === 0) room.turn = "Host";
        else room.turn = "Guest";
                
        // Notify both players that the hame has started and whose turn it is
        socket.to(room.hostSocketID).emit("gameStartResponse", "Complete", room.turn);
        socket.to(room.guestSocketID).emit("gameStartResponse", "Complete", room.turn);
        socket.emit("gameStartResponse", "Complete");

        // Set Timer for Autoshoot
        room.timer = setTimeout( () => {
            randomShoot(socket, room)
        }, timePerRound)

    }


})


// Response to shoot
socket.on("shoot", (location) => {


    room = roomList.find(room => room.hostSocketID === socket.id || room.guestSocketID === socket.id);

    // Check if it is a valid shoot command
    if (room.guestSocketID === socket.id) {
                
        if (room.turn === "Host") {
            socket.emit("shootResponse", "Wrong Turn");
            return;
        }
        if (room.guestShot.includes(location)) {
            socket.emit("shootResponse", "Duplicated Shot");
            return;
        }

    } else if (room.hostSocketID === socket.id) {

        if (room.turn === "Guest") {socket.emit("adminGetRoomIDResponse", "Completed", roomIDList);
            socket.emit("shootResponse", "Wrong Turn");
            return;
        }
        if (room.hostShot.includes(location)) {
            socket.emit("shootResponse", "Duplicated Shot");
            return;
        }
    
    }
    
    // If valid, stop autoshoot timer and shoot manually
    clearTimeout(room.timer);
    shoot(socket, room, location);
    console.log(room);


})


// Response to withdraw
socket.on("withdraw", () => {

    // Find room with matching socket id, let the other player wins, delete the room from the room list, and clear timer 
    roomList.forEach((room) => {

        if (room.guestSocketID === socket.id) {

            socket.to(room.hostSocketID).emit("endResponse", "Withdrew", "Host");
            socket.emit("endResponse", "Guest Withdrew", "Host");
            roomList.splice(roomList.findIndex(room => room.guestSocketID === socket.id, 1));
            if (room.timer != undefined) {clearTimeout(room.timer)};
            console.log("Host Wins");
            console.log(`room ${room.roomID} deleted`);
            
        } else if (room.hostSocketID === socket.id) {

            socket.to(room.guestSocketID).emit("endResponse", "Host Withdrew", "Guest");
            socket.emit("endResponse", "Host Withdrew", "Guest");
            roomList.splice(roomList.findIndex(room => room.hostSocketID === socket.id, 1));
            if (room.timer != undefined) {clearTimeout(room.timer)};
            console.log("Guest Wins");
            console.log(`room ${room.roomID} deleted`);
            
        }

        

    })


})


// Response to withdraw
socket.on("disconnect", () => {

    // Find room with matching socket id, let the other player wins, and delete the room from the room list 
    console.log(`Client gone [id=${socket.id}]`);
    roomList.forEach((room) => {

        if (room.guestSocketID === socket.id) {

            socket.to(room.hostSocketID).emit("endResponse", "Guest Abandoned", "Host");
            roomList.splice(roomList.findIndex(room => room.guestSocketID === socket.id, 1));
            console.log("Host Wins");
            console.log(`room ${room.roomID} deleted`);
            if (room.timer != undefined) {clearTimeout(room.timer)}
            
        } else if (room.hostSocketID === socket.id) {

            socket.to(room.guestSocketID).emit("endResponse", "Host Abandoned", "Guest");
            roomList.splice(roomList.findIndex(room => room.hostSocketID === socket.id, 1));
            console.log("Guest Wins");
            console.log(`room ${room.roomID} deleted`);
            if (room.timer != undefined) {clearTimeout(room.timer)}
        }
    })

    // Check if the socket belongs to admin. If yes, remove the instance from adminList 
    if (checkAdmin(socket.id)) {
        adminList.splice(adminList.findIndex(admin => admin.socketID === socketID, 1));
        console.log("An admin logs out");
    }


})


/////////////////////////////////////////// ADMIN OPERATION ////////////////////////////////////////////

// Global Variable for Admins
adminList = [];
savedHash = "";

class Admin {
    constructor(socketID) {

        this.socketID = socketID;
        this.isWatching = false;

    }
}

// Check if the Socket has admin privilege 
function checkAdmin(socketID) {
    return adminList.includes(admin => admin.socketID === socketID);
}


// Response to admin Login 
socket.on("adminLogin", (hashedAdminPass) => {

    // Check if the admin password is correct
    if (hashedAdminPass === savedHashed) {
        adminList.push(new Admin(socket.id));
        console.log("An admin logs in");
        socket.emit("adminLoginResponse", "Completed");
    } else {
        socket.emit("adminLoginResponse", "Wrong Password");
    }
})


// Response to admin room list 
socket.on("adminGetRoomList", () => {

    // Check privilege 
    if (checkAdmin(socket.id)) {

        // Send all rooms
        socket.emit("adminGetRoomListResponse", "Completed", roomList);

    } else {
        socket.emit("adminGetRoomListResponse", "Connection Not Verified");
    }
})

// Response to admin room ID
socket.on("adminGetRoomID", (filterType, filter) => {

    // Check privilege
    if (checkAdmin(socket.id)) {
        roomIDList = []

        // Check if the username is in any rooom
        if (filterType === "username") {

            for (room in roomList.filter(room => (room.hostUsername === filter || room.guestUsername === filter))) {
                roomIDList.push(room.roomID);
            }

        }
        socket.emit("adminGetRoomIDResponse", "Completed", roomIDList);
    } else {
        socket.emit("adminGetRoomListResponse", "Connection Not Verified");
    }
})

// Response to admin close
socket.on("adminClose", (filterType, filter) => {

    // Check privilege
    if (checkAdmin(socket.id)) {

        // Check if the username is in any rooom
        if (filterType === "username") {

            // Delete all rooms that matches and remove it from the room list
            for (room in roomList.filter(room => (room.hostUsername === filter || room.guestUsername === filter))) {
                roomID = room.roomID;
                socket.to(room.hostSocketID).emit("endResponse", "Closed by Admin");
                socket.to(room.guestSocketID).emit("endResponse", "Closed by Admin");

                console.log(`room ${room.roomID} deleted`);
                if (room.timer != undefined) {clearTimeout(room.timer)}
                roomList.splice(roomList.findIndex(room => room.roomID === roomID, 1));
            }
        
        // Check Using Room ID
        } else if (filterType === "room ID") {

            // Delete all rooms that matches and remove it from the room list
            for (room in roomList.filter(room => (room.roomID === filter))) {
                socket.to(room.hostSocketID).emit("endResponse", "Closed by Admin");
                socket.to(room.guestSocketID).emit("endResponse", "Closed by Admin");

                console.log(`room ${room.roomID} deleted`);
                if (room.timer != undefined) {clearTimeout(room.timer)}
                roomList.splice(roomList.findIndex(room => room.roomID === filter, 1));
            }

        }
        socket.emit("adminCloseResponse", "Completed");
    } else {
        socket.emit("adminCloseResponse", "Connection Not Verified");
    }
})

// Response to admin reset
socket.on("adminReset", (filterType, filter) => {

    // Check privilege
    if (checkAdmin(socket.id)) {

        // Check if the username is in any rooom
        if (filterType === "username") {
            
            // Send response to both clients and Reset all values of the room to before set up
            for (room in roomList.filter(room => (room.hostUsername === filter || room.guestUsername === filter))) {
                socket.to(room.hostSocketID).emit("endResponse", "Reset by Admin");
                socket.to(room.guestSocketID).emit("endResponse", "Reset by Admin");

                room.guestReady = false;
                room.hostReady = false;
                room.guestScore = 0;
                room.hostScore = 0;
                turn = undefined;
                room.hostShips = [];
                room.guestShips = [];
                room.hostShot = [];
                room.guestShot = [];
                if (room.timer != undefined) {clearTimeout(room.timer)}
            }

        // Check Using Room ID
        } else if (filterType === "room ID") {

            // Send response to both clients and Reset all values of the room to before set up
            room = roomList.find(room => (room.roomID === filter)) 
            socket.to(room.hostSocketID).emit("endResponse", "Reset by Admin");
            socket.to(room.guestSocketID).emit("endResponse", "Reset by Admin");

            room.guestReady = false;
            room.hostReady = false;
            room.guestScore = 0;
            room.hostScore = 0;
            room.turn = undefined;
            room.hostShips = [];
            room.guestShips = [];
            room.hostShot = [];
            room.guestShot = [];
            if (room.timer != undefined) {clearTimeout(room.timer)}
            

        }
        socket.emit("adminResetResponse", "Completed");
    } else {
        socket.emit("adminResetResponse", "Connection Not Verified");
    }
})

// Response to admin spectate
socket.on("adminSpectate", (roomID) => {

    // Check privilege
    if (checkAdmin(socket.id)) {

        // Check if the admin is already watching any game. If not, subscribe admin to the room
        if (adminList.find(admin => admin.socketID === socketID).isWatching) {
            socket.emit("adminSpectateResponse", "Already Watching");
        } else {
            roomList.find(room => (room.roomID == roomID)).spectator = socket.id;
        }

    } else {
        socket.emit("adminSpectateResponse", "Connection Not Verified");
    }
})

// Response to admin stop spectate
socket.on("adminStopSpectate", (roomID) => {

    // Check privilege
    if (checkAdmin(socket.id)) {

        // Check if the admin is already watching any game. If yes, unsubscribe admin to the room
        if (adminList.find(admin => admin.socketID === socketID).isWatching) {
            roomList.find(room => (room.roomID == roomID)).spectator = undefined;
            socket.emit("adminStopSpectateResponse", "Completed");
        } else {
            socket.emit("adminStopResponse", "Not Watching");
        }
    } else {
        socket.emit("adminWatchResponse", "Connection Not Verified");
    }

    roomList.find(room => (room.roomID == roomID)).watcher = undefined;
    socket.emit("adminStopWatchResponse", "Completed");
})

})
