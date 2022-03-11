import socket as soc
import sys,pickle
import ipaddress as ip


class Client():
    def __init__(self, IP, password):
        self.IP = IP
        self.password = password

    def makeconnection(self):
        self.clientsocket = soc.socket(soc.AF_INET, soc.SOCK_STREAM)
        self.clientsocket.connect((self.IP, 9898)) #connecting to server
        print("Connected")
        sys.stdout.flush()
        self.clientsocket.send(bytes(self.password.encode("utf-8"))) #sending password for validation
        response = self.clientsocket.recv(1024).decode() #receiving response

        if(response == "PasswordIncorrect"): #if incoorect response exiting python code 
            print("PasswordError")
            sys.stdout.flush()
            exit()
        else:                                #else proceeding for further process
            print("PasswordCorrect") 
            sys.stdout.flush()

        print("Finished")
        sys.stdout.flush()

if __name__ == "__main__":
    IP = int(input()) #getting the int ID
    IP = ip.ip_address(IP).__str__() #converting to valid str ip
    password = input().strip() #getting the password from password field
    file = open("remoteid.txt", "w")
    file.write(IP) #writing the IP to the file
    file.close()
    client = Client(IP, password)
    try:
        client.makeconnection() #making connection
    except Exception:
        print("IDError")
        sys.stdout.flush()
    
