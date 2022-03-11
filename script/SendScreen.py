import io,sys,pyautogui
import socket as soc
from threading import Thread
import pickle

class SendScreen(Thread):
    def __init__(self,clientsocket):
        super().__init__()
        self.clientsocket=clientsocket

    def run(self):
        while True:
            image=pyautogui.screenshot()  #responsible for screenshot of screen to be sent
            imagedata=io.BytesIO()  #creating BytesIO object because we want to extract the image bytes data and save it to file object(type of object which has write,read method).But we dont want to save it file so BytesIO
            image.save(imagedata,format="PNG") #this is resposible for saving the image in BytesIO object imagedata and also specifying the Format which is 'Portable Network Graphics'
            self.clientsocket.sendall(imagedata.getvalue()) #this actually sends data . Now why not use send because send method only send limited amount of data at a time ie. 64kb and our image can be larger than that,So the reesulted image is in broken state causing eror while displaying image at recving end .sendall method sends all the bytes submitted to it . Which actually makes the use of send method in loop

            # self.clientsocket.send("Hello From client".encode("ascii"))
            # print("Msg Sent",file=sys.stdout,flush=True)
            # # self.clientsocket.close()

class RecvEvent(Thread):
    def __init__(self,clientsocket):
        super().__init__()
        self.clientsocket=clientsocket

    def run(self):
        width,height=pyautogui.size()

        try:
            while True:
                data=pickle.loads(self.clientsocket.recv(4096))
                if data["event"]=="mousemove":
                    pyautogui.moveTo(x = data["X"] * width,y = data["Y"] * height, duration=0.0)
                    # print(data["event"],file=sys.stdout,flush=True)

                elif data["event"]=="mouseclick":
                    if data["button"]==1:
                        pyautogui.click(x = data["X"] *width,y = data["Y"] * height, duration=0.0)
                    else:
                        pyautogui.rightClick(x = data["X"] *width,y = data["Y"] * height, duration=0.0)
                    # print(data["event"], file=sys.stdout, flush=True)

                elif data["event"]=="keypress":
                    pyautogui.press(data["button"])
                    # print(data["event"], file=sys.stdout, flush=True)

        except Exception:
            print("Connection Error")
            sys.stdout.flush()


if __name__=="__main__":
    clientsocket=soc.socket(soc.AF_INET,soc.SOCK_STREAM) #creating client socket 
    file = open("remoteid.txt", "r")    #reading the ID from file which is created during the autentication
    IP = file.readline()
    file.close()
    pyautogui.FAILSAFE=False
    while True:
        try:
            clientsocket.connect((IP,7878)) #makeing the connection... if not connecting making connection again thats why while loop
            break
        except Exception:
            pass
    sendscreen=SendScreen(clientsocket)
    recvevent=RecvEvent(clientsocket)
    sendscreen.start() #starting the sending image thread
    recvevent.start() #starting the recv events thread
    
