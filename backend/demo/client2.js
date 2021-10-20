const io = require("socket.io-client"); 
const encrypt = require("socket.io-encrypt");
const cryptojs = require("crypto-js");

ioClient = io.connect("http://localhost:8000");
encrypt('secretKey')(ioClient)

ioClient.on("SocketID", (recvSocketID) => {
    console.info("Socket ID is: " + recvSocketID);
    socketID = recvSocketID;
    role = "Guest"
})

ioClient.on("createRoomResponse", (response, roomID) => {
    if (reponse === "Complete") {
        console.log("room id is " + roomID)
        role = "Host"
    } else if (response === "Exceeded") {
        console.log("Too many rooms are created by your IP address. Please contact admin if you wish to stop all games with your IP Address");
    }
    
});

ioClient.on("joinRoomResponse", (response, username) => {
    if (response === "Complete") {
        role = "Guest";
        if (role === "Host") {
            guestUsername = username;
            console.log(guestUsername + " joined the room.");
        } else {
            role = "Guest"
            hostUsername = username;
            console.log(`joined ${hostUsername}'s room`);
        }
    } else {
        console.log(response);
    }
       
});

ioClient.on("setupResponse", (response, hostReady, guestReady) => {
    if (response === "Complete") {
        if (hostReady) console.log("Host is ready");
        if (guestReady) console.log("Guest is ready");
    } else {
        console.log(response);
    }
})

ioClient.on("endResponse", (response, winner) => {
    console.log(`${winner} wins because ${response}`)
    //clear cache
})


ioClient.on("gameStartResponse", (response) => {
    console.log("Starting game...");
})

ioClient.on("shootResponse", (response, location, shooter, nextturn) => {
    if (response === "Hit" || response === "Miss") {
        console.log(shooter + response + location);
    }
    console.log(response);
})


ioClient.on("disconnect", () => console.info(`Disconnected from Server`));

username = "testGuest";
password = "password123";
roomID = 0

if (password != "") {
    roomHashedPass = cryptojs.MD5(password).toString();
} else roomHashedPass = password

coordinates = ["G1", "G2", "G3", "G4", "G5", "G6", "G7", "G8", "H1", "H2", "H3", "H4", "H5", "H6", "H7", "H8"];


function firstFunction(_callback){
    ioClient.emit("joinRoom", username, roomID, roomHashedPass);
    // do some asynchronous work
    // and when the asynchronous stuff is complete
    _callback();    
}

function secondFunction(){
    // call first function and pass in a callback function which
    // first function runs when it has completed
    firstFunction(() => {
        ioClient.emit("setup", coordinates);
    });    
}

setTimeout(function() {
    //ioClient.emit("withdraw");
  }, 5000);

secondFunction();

