import sys
import os
import os.path
import Save
from zipfile import ZipFile
import math


def recvfile(clientsocket):
    filesnamelist = list(clientsocket.recv(1024).decode().lstrip("[").rstrip("]").split(","))  # getting filenames and converting to string
    clientsocket.send(bytes("got it".encode("utf-8")))
    totalsize = int(clientsocket.recv(1024).decode(errors="ignore"))  # getting totalsize
    recvsize = 0

    newfile = open("Received.zip", "wb")  # opening a zip file

    while True:  # this while loop is resposible for receiving incoming data of zip file and writing the data in newly created Receivedfile.zip
        data = clientsocket.recv(1048576)
        if(data == b''):
            break
        newfile.write(data)
        recvsize += sys.getsizeof(data)
        if(recvsize > totalsize):
            print("100")
            sys.stdout.flush()
        else:
            per = math.floor((recvsize/totalsize)*100)
            print(per)
            sys.stdout.flush()

    newfile.close()

    for file in filesnamelist:  # this adds name of received files to GUI
        print("file"+file)
        sys.stdout.flush()

    return "done"  # returns done so that python shell can terminate this process just be sure script stops


if __name__ == "__main__":
    pass
