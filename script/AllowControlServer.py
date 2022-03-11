import socket as soc
import IP_PORT_ID
import sys
from threading import Thread
import ChattingServer


class Server():
    def __init__(self, IP, password):
        self.IP = IP
        self.password = password

    def startserver(self):
        self.serversocket = soc.socket(soc.AF_INET, soc.SOCK_STREAM)
        self.serversocket.bind((self.IP, 9898))
        self.serversocket.listen(3)
        print("serverstarted")
        sys.stdout.flush()

        while True:
            self.clientsocket, self.adrs = self.serversocket.accept() #getting the connection
            file=open("remoteid.txt","w") #opening a file
            file.write(self.adrs[0]) #writing the ip  of client machine who is going to control server
            file.close()
            print("Connected")
            sys.stdout.flush()
            remotepassword = self.clientsocket.recv(1024).decode() #getting the password entered by client machine
            if remotepassword != password: #checking for valid password
                self.clientsocket.send(bytes("PasswordIncorrect".encode("utf-8")))
            else:   #if not send suitable msg and re running the server for new connection with valid pass
                self.clientsocket.send(bytes("PasswordCorrect".encode("utf-8")))
                print("ConnectionSecure")
                sys.stdout.flush()
                break

        print("Finished")
        sys.stdout.flush()


if __name__ == "__main__":
    IP = IP_PORT_ID.IP      #getting IP from IP_PORT_ID module 
    password = input().strip() #getting password form password field
    server = Server(IP, password)
    server.startserver() #starting server for authentication
