import sys
import FileTransferClient
import socket as soc
import os.path
from zipfile import ZipFile
import math


def startSending(clientsocket, filesnamelist, totalsize):

    print("Sendmsg")
    sys.stdout.flush()

    # than we create zip file and add all the files to the zip file by passig the file path which we got earlier
    with ZipFile("OConnectFileszip.zip", "w") as zip:
        for filepath in filepathlist:
            # this where we are writing the choosed files data to zip for creating zip
            zip.write(filepath)
    # this the list of files that are going to received on receiving end
    clientsocket.send(bytes("{}".format(filesnamelist).encode("utf-8")))
    msg=clientsocket.recv(1024)
    # this is the toatl size of the file
    clientsocket.send(bytes(str(totalsize).encode("utf-8")))
    sentsize = 0
    per = 0
    # opening zip file which is created earlier
    newfile = open("OConnectFileszip.zip", "rb")

    while True:  # this while loop is resposible for sending the zip file data to reciving end
        data = newfile.read(1048576)
        if(data == b''):
            clientsocket.send(b'')
            break
        clientsocket.send(data)
        sentsize += 1048576
        per = math.floor((sentsize/totalsize)*100)
        print(per)
        sys.stdout.flush()

    newfile.close()
    os.remove("temp.txt")
    os.remove("OConnectFileszip.zip")

    # sending done msg to python shell so that it can terminate this pyton file explicitly
    print("done")
    sys.stdout.flush()


if __name__ == "__main__":
    file = open("temp.txt", "r")
    # we read the IP address which is collected from FileTransferClient and saved to temp.txt
    IP = file.readline()
    file.close()

    # this is input of file paths given by either Choose button or Drop down box
    filepathlist = list(input().split(","))
    # split the paths so that we can get no fo files and file path of each file
    # print(filepathlist)
    # sys.stdout.flush()

    filesnamelist = []  # we are having different list for names of files
    filessizelist = []  # we want to also store the filesize so that we can make progress bar
    totalsize=0

    for path in filepathlist:  # performing operation to extract file names from file path as well as to get size of all file
        name = path.split("\\")
        filesnamelist.append(name[len(name)-1])
        totalsize = totalsize + os.path.getsize(path)
        # filessizelist.append(size)

    print(totalsize)
    sys.stdout.flush()
    # calculating total file size using in built sum function
    # totalsize = sum(filessizelist)

    if totalsize >= 524288000:
        print("FileSizeError")
        sys.stdout.flush()
        exit()

    try:
        # again make the connection
        clientsocket = soc.socket(soc.AF_INET, soc.SOCK_STREAM)
        clientsocket.connect((IP, 9898))
        startSending(clientsocket, filesnamelist, totalsize)
    except Exception:
        print("ConnectionError")
