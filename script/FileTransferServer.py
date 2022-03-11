import IP_PORT_ID
import socket as soc
import sys
import ReceiveFiles


class Server():
    def __init__(self, IP, PORT):
        self.IP = IP
        self.PORT = PORT
        self.serversocket = soc.socket(soc.AF_INET, soc.SOCK_STREAM)
        self.serversocket.bind((self.IP, self.PORT))
        self.serversocket.listen(1)

    def start(self):
        print("started")
        sys.stdout.flush()
        # this socket is for checking purpose of wheter we are able to make connection
        self.clientsocket, self.addr = self.serversocket.accept()
        print("Connected")
        sys.stdout.flush()
        msg = self.clientsocket.recv(1024).decode()
        print(msg)
        sys.stdout.flush()
        self.clientsocket.close()
        # the below code actually makes the connection and resposible for sending files
        try:
            self.clientsocket, self.addr = self.serversocket.accept()
            msg = ReceiveFiles.recvfile(self.clientsocket)
            print(msg)
            sys.stdout.flush()
        except Exception:
            print("ConnectionError")
            sys.stdout.flush()


if __name__ == "__main__":
    server = Server(IP_PORT_ID.IP, IP_PORT_ID.PORT)
    server.start()
