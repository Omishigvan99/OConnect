from zipfile import ZipFile
import os
import os.path
import sys


def save(path):

    print("Savingmsg")
    sys.stdout.flush()

    # since the received file is zip we use ZipFile, create new files from the files inside of zip file and extract one by one
    with ZipFile("Received.zip", "r") as zip:
        for i in range(len(zip.namelist())):
            name = list(zip.namelist()[i].split("/"))
            data = zip.read(zip.namelist()[i])
            file = open(os.path.join(path, name[len(name)-1]), "wb")
            file.write(data)

    os.remove("Received.zip")
    print("finished")
    sys.stdout.flush()


if __name__ == "__main__":
    path = input()  # using python shell we send data as input stream which is path where user wants to save data and store it in paath variable which is then passed to save method
    save(path)
