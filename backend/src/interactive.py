import socketio

sio = socketio.Client()
sio.connect("http://localhost:8000")


class Player:
    def __init__(self) -> None:
        pass


user = Player()
user.shot = []
opponent = Player()
opponent.shot = []


@sio.on("getRoomListResponse", namespace="/")
def message(responseStatus, data):
    print(data)


@sio.on("createRoomResponse", namespace="/")
def message(responseStatus, roomID):
    print(responseStatus)
    print(roomID)


@sio.on("joinRoomResponse", namespace="/")
def message(responseStatus, playername):
    print(responseStatus)
    if user.status == "Host":
        opponent.name = playername
        opponent.status = "Guest"
    else:
        opponent.name = playername
        opponent.status = "Host"


@sio.on("setupResponse", namespace="/")
def message(responseStatus, hostReady, guestReady):
    print(responseStatus)
    print("host is ready: " + str(hostReady))
    print("guest is ready: " + str(guestReady))
    if user.status == "Host":
        user.ready = hostReady
        opponent.ready = guestReady
    else:
        user.ready = guestReady
        opponent.ready = hostReady


@sio.on("gameStartResponse", namespace="/")
def message(responseStatus, firstPlayer):
    print(responseStatus)
    print("Turn : 1")

    whosNext(firstPlayer)


@sio.on("shootResponse", namespace="/")
def message(responseStatus, location, currentTurnPlayer, nextTurnPlayer, turnCount):

    if responseStatus == "Hit" or responseStatus == "Miss":
        if currentTurnPlayer == user.status:
            print("You shot" + location)
            print(responseStatus)

        else:
            print("Opponent shot" + location)
            print(responseStatus)

        print("-" * 10)
        print("Turn :" + str(turnCount))

        whosNext(nextTurnPlayer)

    else:
        print(responseStatus)


@sio.on("endResponse", namespace="/")
def message(responseStatus, winner, hostScore, guestScore):
    user.shot = []
    opponent.shot = []
    if user.status == winner:
        print("winner is " + user.name)
    else:
        print("winner is" + opponent.name)

    print("Reason: " + responseStatus)
    print("Total Score")
    if user.status == "Host":
        print(user.name + ": " + str(hostScore))
        print(opponent.name + ": " + str(guestScore))
    else:
        print(opponent.name + ": " + str(hostScore))
        print(user.name + ": " + str(guestScore))

    if (
        responseStatus == "Withdrew"
        or responseStatus == "Abandoned"
        or responseStatus == "Closed by Admin"
    ):
        print("room closed.")


@sio.event
def disconnect():
    print("Disconnected!")


def whosNext(next):
    if user.status == next:
        print("Your turn:")
    else:
        print("Opponent's turn:")


def createRoom(username, password):
    sio.emit("createRoom", data=(username, password))
    user.name = username
    user.status = "Host"


def joinRoom(username, roomID, password):
    sio.emit("joinRoom", data=(username, roomID, password))
    user.name = username
    user.status = "Guest"


def setup(coordinates):
    sio.emit("setup", coordinates)


def shoot(coordinate):
    coordinate = coordinate.upper()
    if coordinate in user.shot:
        print("Already shot " + coordinate)
        return
    sio.emit("shoot", coordinate)
    user.shot.append(coordinate)


def withdraw():
    sio.emit("withdraw")


def getRoomList():
    sio.emit("getRoomList")


cli_input = input()
cli_input = cli_input.split(" ")

while cli_input[0] != "exit":

    if cli_input[0].lower() == "getroomlist":
        getRoomList()
    elif cli_input[0].lower() == "createroom":
        createRoom(cli_input[1], cli_input[2])

    elif cli_input[0].lower() == "joinroom":

        joinRoom(cli_input[1], cli_input[2], cli_input[3])

    elif cli_input[0].lower() == "setup":
        if cli_input[1] == "default":
            coordinates = [
                "A1",
                "A2",
                "A3",
                "A4",
                "A5",
                "A6",
                "A7",
                "A8",
                "B1",
                "B2",
                "B3",
                "B4",
                "B5",
                "B6",
                "B7",
                "B8",
            ]
        else:
            coordinates = [
                cli_input[1],
                cli_input[2],
                cli_input[3],
                cli_input[4],
                cli_input[5],
                cli_input[6],
                cli_input[7],
                cli_input[8],
                cli_input[9],
                cli_input[10],
                cli_input[11],
                cli_input[12],
                cli_input[13],
                cli_input[14],
                cli_input[15],
                cli_input[16],
            ]
        setup(coordinates)

    elif cli_input[0].lower() == "shoot":
        shoot(cli_input[1])

    elif cli_input[0].lower() == "withdraw":
        withdraw()

    cli_input = input()
    cli_input = cli_input.split(" ")

sio.disconnect()
