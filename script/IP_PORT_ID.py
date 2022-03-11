import socket as soc
import ipaddress as ip
import sys
import random

IP = soc.gethostbyname(soc.gethostname())
PORT = 9898
ID = int(ip.ip_address(IP))
text = "0123456789abcdefghijklmnopqrstuvwxyz!@#$%"
password = ""

for i in range(8):
    password = password+random.choice(text)

if __name__ == "__main__":
    print(ID)
    print(password)
    sys.stdout.flush()

