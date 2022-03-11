import sys,base64
import socket as soc
from threading import Thread
import IP_PORT_ID
import pickle

class RecvScreen(Thread):
    def __init__(self,clientsocket):
        super().__init__()
        self.clientsocket=clientsocket

    def run(self):
        print("Reciving Thread Started")
        # sys.stdout.flush()
        try:
            while True:
                data=self.clientsocket.recv(999999)     #receving about 1mb of data
                file = open("remotescreen.png", "wb")   #writing that data to a file of image type
                file.write(data)

                # data=self.clientsocket.recv(4098)
                # print(data.decode("ascii"),file=sys.stdout,flush=True)
                # # clientsocket.close()

        except Exception:
            print("ConnectionError")
            sys.stdout.flush()


class SendEvent(Thread):
    def __init__(self,clientsocket):
        super().__init__()
        self.clientsocket=clientsocket

    def run(self):
        data={"event":None,"X":0,"Y":0,"button":0} #creating a dictionary for sending data of events more convenient
        while True:
            try:
                info=input().split(" ") #seprating the data coming as input form the java script file
                data["event"]=info[0]
                data["X"]=float(info[1])
                data["Y"]=float(info[2])
                try:
                    data["button"]=int(info[3])
                except Exception as e:
                    data["button"]=info[3]
                
                packet=pickle.dumps(data) #converts that data dictionary into serialized object so that it can be sent over network and receivedd as dictionary on the other net
                self.clientsocket.sendall(packet) #sending the data
            except Exception as e:
                print(e)
                sys.stdout.flush()


if __name__=="__main__":
    serversocket=soc.socket(soc.AF_INET,soc.SOCK_STREAM) #creating serversocket for remote handling
    IP=IP_PORT_ID.IP
    serversocket.bind((IP,7878))
    serversocket.listen(1)
    clientsocket,addrs=serversocket.accept()
    recvscreen=RecvScreen(clientsocket)
    sendevent=SendEvent(clientsocket)
    recvscreen.start() #starting the recv screen thread.
    sendevent.start() #starting the send event thread
