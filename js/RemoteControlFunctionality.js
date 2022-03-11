const BrowserWindow = require("electron").remote.BrowserWindow
const screen = require("electron").remote.screen

AllowControlServer = undefined
RemoteControlClient = undefined

document.getElementById("section1btn").addEventListener("click", () => {
    AllowControlServer = new PythonShell("./script/AllowControlServer.py")
    AllowControlServer.send(document.getElementById("Password1").value)

    AllowControlServer.on("message", (msg) => {
        switch (msg) {
            case "serverstarted":
                console.log(msg)
                document.getElementById("allowcontrolstatus").style.backgroundColor = "orange"
                document.getElementById("allowcontrolstatus").style.borderColor = "orange"
                break;

            case "Connected":
                console.log(msg)
                document.getElementById("allowcontrolstatus").style.backgroundColor = "green"
                document.getElementById("allowcontrolstatus").style.borderColor = "green"
                break;

            case "ConnectionSecure":
                msgwin = new BrowserWindow({
                    show: false,
                    resizable: false,
                    height: 330,
                    width: 430,
                    webPreferences: {
                        nodeIntegration: true
                    }
                })

                // msgwin.setMenu(null)
                msgwin.loadFile("index.html")
                msgwin.webContents.on("did-finish-load", () => {
                    msgwin.show()
                })
                msgwin.on("closed", () => {
                    msgwin = null
                })
                break;

            case "Finished":
                console.log(msg)
                break

            default:
                console.log(msg)
                break;
        }
    })

    AllowControlServer.end((err) => {
        if (err) throw err
    })
})

document.getElementById("section2btn").addEventListener("click", () => {
    ID = Number(document.getElementById("yourID2").value)
    Password = document.getElementById("Password2").value

    if (!/^[\d]{1,10}$/.test(ID)) {
        dialog.showErrorBox("Invalid Input", "ID field must conatin only digits with maximum length of 10 and should not be left empty\nCheck your input")
    }
    else if (!/.{8}$/.test(Password)) {
        dialog.showErrorBox("Invalid Input", "Password must be of 8 charachters long\nCheck your input")
    }
    else {
        console.log("You have done it...")
        RemoteControlClient = new PythonShell("./script/RemoteControlClient.py")
        RemoteControlClient.send(document.getElementById("yourID2").value)
        RemoteControlClient.send(document.getElementById("Password2").value)

        RemoteControlClient.on("message", (msg) => {
            switch (msg) {

                case "IDError":
                    dialog.showErrorBox("IDError","Remote host not found :( Check for Correct ID")
                    break;
                case "PasswordError":
                    dialog.showErrorBox("Authentication Error", "Entered password did not match the password on remote PC no connection could be made :(")
                    break;

                case "PasswordCorrect":
                    console.log("Userscreen")
                    const { height, width } = screen.getPrimaryDisplay().workAreaSize
                    userscreen = new BrowserWindow({
                        height,
                        width,
                        show: false,
                        webPreferences: {
                            nodeIntegration: true
                        }
                    })

                    userscreen.loadFile("image.html")
                    userscreen.maximize()
                    userscreen.webContents.on("did-finish-load", () => {
                        userscreen.show()
                    })
                    userscreen.on("closed", () => {
                        userscreen = null
                    })

                    break;

                case "Connected":
                    console.log(msg)
                    break;

                case "Finished":
                    console.log(msg)
                    break;

                default:
                    console.log(msg)
                    break;
            }
        })

        RemoteControlClient.end((err) => {
            if (err) throw err
        })
    }
})




