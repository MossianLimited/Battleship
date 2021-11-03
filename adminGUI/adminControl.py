import PySimpleGUI as sg
import time
import socketio

def adminControl(sio, instance):
    sg.theme('DarkBlue')   # Add a touch of color
    # All the stuff inside your window.

    controlLayout = [ [sg.Button('Get All Room')],
                [sg.Text("Find User"), sg.InputText(), sg.Button('Find Room')],
                [sg.Multiline(size=(75,20), key = "mt1", autoscroll=True, reroute_stdout=True, write_only=True, reroute_cprint=True)],
                [sg.Text("RoomID"), sg.InputText(), sg.Button('Reset'), sg.Button('Close')],
                [sg.Button("Exit")]]


    # Create the Window
    controlWindow = sg.Window('AdminControl', controlLayout, finalize=True)


    # Event Loop to process "events" and get the "values" of the inputs
    while True:
        controlEvent, controlValues = controlWindow.read()
        if controlEvent == sg.WIN_CLOSED or controlEvent == 'Exit':
            break
        elif controlEvent == "Get All Room":
            sio.emit("adminGetRoomList")
            time.sleep(1)
            controlWindow['mt1'].update("RoomID %-*s  Host Username %-*s  Guest Username\n" % (20," ", 15, " "))
            controlWindow['mt1'].print("-" * 75)
            for room in instance.roomList:
                controlWindow['mt1'].print("%-*s %-*s %s" % (30, room["roomID"], 30, room["hostUsername"], room["guestUsername"]))
        elif controlEvent == "Find Room":
            sio.emit("adminGetRoomID", ("username", controlValues[0]))
            time.sleep(1)
            controlWindow['mt1'].update("Matching Room ID List\n")
            controlWindow['mt1'].print("-" * 75)
            for room in instance.roomList:
                controlWindow['mt1'].print(room)
        elif controlEvent == "Reset":
            sio.emit("adminReset", ("room ID", controlValues[1]))
            sg.popup("Room %s Reset" % controlValues[1])
        elif controlEvent == "Close":
            sio.emit("adminClose", ("room ID", controlValues[1]))
            sg.popup("Room %s Closed" % controlValues[1])

        
    controlWindow.close()