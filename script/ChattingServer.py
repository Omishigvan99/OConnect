from threading import Thread
import sys
import socket as soc
import IP_PORT_ID


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
                break


if __name__ == "__main__":
    serversocketmsg = soc.socket(soc.AF_INET, soc.SOCK_STREAM)
    serversocketmsg.bind((IP_PORT_ID.IP, 8787))
    serversocketmsg.listen(1)
    clientsocketmsg, adrs = serversocketmsg.accept()
    sendmsg = SendMsg(clientsocketmsg)
    recvmsg = RecvMsg(clientsocketmsg)
    sendmsg.start()
    recvmsg.start()
