import PySimpleGUI as sg
import time
import socketio

from adminControl import adminControl

sio = socketio.Client()
sio.connect('http://localhost:8000')

class Instance:
    def __init__(self) -> None:
        self.isLoggedIn = False
        self.roomList = ()
        pass

instance = Instance()

@sio.on('adminLoginResponse', namespace = "/")
def message(responseStatus):
    if(responseStatus == "Completed"): instance.isLoggedIn = True
    else: instance.isLoggedIn = False

@sio.on('adminGetRoomListResponse', namespace = "/")
def message(responseStatus, list):
    if(responseStatus == "Completed"): 
        instance.roomList = list

@sio.on('adminGetRoomIDResponse', namespace = "/")
def message(responseStatus, list):
    if(responseStatus == "Completed"): 
        instance.roomList = list


sg.theme('DarkBlue')   # Add a touch of color
# All the stuff inside your window.
loginLayout = [  [sg.Text('Enter Password'), sg.InputText()],
            [sg.Button('Ok'), sg.Button('Cancel')] ]


# Create the Window
loginWindow = sg.Window('AdminLogin', loginLayout, finalize=True)

# Event Loop to process "events" and get the "values" of the inputs
while True:
    loginEvent, loginValues = loginWindow.read()
    if loginEvent == sg.WIN_CLOSED or loginEvent == 'Cancel': # if user closes window or clicks cancel
        sio.emit("disconnect")
        break
    print('You entered ', loginValues[0])
    sio.emit("adminLogin", loginValues[0])
    time.sleep(1)
    if(instance.isLoggedIn == True):
        print("You are logged in")
        loginWindow.close()
        adminControl(sio, instance)
    else:
        sg.popup("Invalid Password")
                
loginWindow.close()