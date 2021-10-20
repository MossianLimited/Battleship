const io = require("socket.io-client"); 
const encrypt = require("socket.io-encrypt");
const cryptojs = require("crypto-js");

ioClient = io.connect("http://localhost:8000");
encrypt('secretKey')(ioClient)

ioClient.on("SocketID", (recvSocketID) => {
    console.info("Socket ID is: " + recvSocketID);
    socketID = recvSocketID;
})

ioClient.on("createRoomResponse", (response, roomID) => {
    if (response === "Complete") {
        console.log("room id is " + roomID)
        ioClient.emit("setup", coordinates);
    } else if (response === "Exceeded") {
        console.log("Too many rooms are created by your IP address. Please contact admin if you wish to stop all games by your IP")
    }
    
});

ioClient.on("joinRoomResponse", (response, username) => {
    if (response === "Complete") {
        role = "Host";
        if (role === "Host") {
            guestUsername = username;
            console.log(guestUsername + " joined the room.");
        } else {
            role = "Guest"
            hostUsername = username;
            console.log(`joined ${hostUsername}'s room`);
        }
    }
       
});

ioClient.on("endResponse", (response, winner) => {
    console.log(`winner is ${winner} because ${response}`)
    //clear cache
})


ioClient.on("setupResponse", (response, hostReady, guestReady) => {
    if (response === "Complete") {
        if (hostReady) console.log("Host is ready");
        if (guestReady) console.log("Guest is ready");
    } else {
        console.log(response);
    }
})

ioClient.on("gameStartResponse", (response) => {
    console.log("Starting game...");
})

ioClient.on("shootResponse", (response, location, shooter, nextturn) => {
    if (response === "Hit" || response === "Miss") {
        console.log(shooter + response + location);
    } else {
    console.log(response);
    }
})

ioClient.on("disconnect", () => console.info(`Disconnected from Server`));


username = "testHost";
password = "password123";

if (password != "") {
    roomHashedPass = cryptojs.MD5(password).toString();
} else roomHashedPass = password

coordinates = ["A1", "A2", "A3", "A4", "A5", "A6", "A7", "A8", "B1", "B2", "B3", "B4", "B5", "B6", "B7", "B8"];

ioClient.emit("createRoom", username, roomHashedPass);
