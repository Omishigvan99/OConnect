from threading import Thread
import sys
import socket as soc


class SendMsg(Thread):
    def __init__(self, clientsocketmsg):
        self.clientsocketmsg = clientsocketmsg
        super().__init__()

    def run(self):
        while True:
            msg = input()
            self.clientsocketmsg.send(bytes(msg.encode()))


class RecvMsg(Thread):
    def __init__(self, clientsocketmsg):
        self.clientsocketmsg = clientsocketmsg
        super().__init__()

    def run(self):
        while True:
            try:
                msg = self.clientsocketmsg.recv(2048).decode()
                print(msg)
                sys.stdout.flush()
            except Exception:
                print("MsgBoxTerminationFromRemote")
                sys.stdout.flush()


if __name__ == "__main__":
    clientsocketmsg = soc.socket(soc.AF_INET, soc.SOCK_STREAM)
    file = open("remoteid.txt", "r")
    IP = file.readline()
    file.close()
    while True:
        try:
            clientsocketmsg.connect((IP, 8787))
            break
        except Exception:
            pass

    sendmsg = SendMsg(clientsocketmsg)
    recvmsg = RecvMsg(clientsocketmsg)
    sendmsg.start()
    recvmsg.start()
