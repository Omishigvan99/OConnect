import socket as soc
import ipaddress as ip
import sys
import SendFiles


class Client():
    def __init__(self, IP, PORT):
        self.IP = IP
        self.PORT = PORT
        self.clientsocket = soc.socket(soc.AF_INET, soc.SOCK_STREAM)

    def startReceiving(self):
        self.clientsocket.connect((self.IP, self.PORT))
        print("Connected")
        sys.stdout.flush()
        self.clientsocket.send(bytes(soc.gethostname().encode("utf-8")))
        file = open("temp.txt", "w")
        file.write(self.IP)
        file.close()


if __name__ == "__main__":
    IP = int(input())
    IP = ip.ip_address(IP).__str__()
    client = Client(IP, PORT=9898)
    client.startReceiving()
