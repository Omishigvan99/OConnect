const { dialog, getCurrentWindow } = require("electron").remote
// const PythonShell=require("python-shell").PythonShell no need to declare here since its already declared in OConnectEffects.js

FileTransferServer = undefined
FileTransferClient = undefined
SendFiles = undefined
Save = undefined
filepath = undefined
warningflag = 0
receivingflag = 0

//this code is for using open dialog box for file selection //invokes window native API
document.getElementById("Fsection2btn2").addEventListener("click", () => {
    filepath = dialog.showOpenDialogSync({ properties: ["openFile", "multiSelections"] })
    // console.log(typeof(filepath))
    if (filepath != undefined) {
        console.log(filepath)
        document.getElementById("Fsection2btn3").disabled = false
        document.getElementById("Fsection2btn2label").innerHTML = " ready to send"
    }
})


//this code is for receiving or starting server script
document.getElementById("Fsection3btn1").addEventListener("click", () => {
    FileTransferServer = new PythonShell("./script/FileTransferServer.py")
    warningflag = 1

    FileTransferServer.on("message", (message) => {
        if (message == "started") {
            console.log("started receiving")
            receivestatus = document.getElementById("receivestatus")
            receivestatus.style.background = "orange"
            receivestatus.style.borderColor = "orange"
            document.getElementById("Fsection3btn1").disabled = true
            document.getElementById("receiveprogress").removeAttribute("value")
        }

        else if (message == "Connected") {
            receivestatus = document.getElementById("receivestatus")
            receivestatus.style.background = "#1FFF00"
            receivestatus.style.borderColor = "#1FFF00"
        }

        else if (/^file/.test(message)) {
            option = document.createElement("option")
            option.innerHTML = message.replace(/^file/, "")
            document.getElementById("receivedfiles").appendChild(option)
        }

        else if (message == "done") {
            i = dialog.showMessageBox({ type: "info", title: "Status", message: "Files received successfully !!" })
            warningflag = 0
            console.log(message)
        }

        else if (message == "ConnectionError") {
            dialog.showErrorBox("Remote Connection got closed. Try connecting again", "Something went wrong!!!! :(")
            FileTransferServer.end()
            document.getElementById("receivestatus").style.background = "red"
            document.getElementById("receivestatus").style.borderColor = "red"
            document.getElementById("sendprogress").value = "0"
        }

        else if(message== "That error"){
            console.log(message)
        }

        else if (message != null) {
            console.log(message)
            try {
                document.getElementById("receiveprogress").value = message
            } catch{

            }
        }
    })

    FileTransferServer.end((err) => {
        if (err) throw err.stack
    })
})


//this is code for making connection withe the server from client side and also checking the input
document.getElementById("Fsection2btn1").addEventListener("click", () => {

    IP = document.getElementById("Fsection2input").value

    if (IP == '')
        IP = null
    else
        IP = Number(IP)

    expression = /^[\d]{1,10}$/
    if (IP != null && expression.test(IP)) {

        FileTransferClient = new PythonShell("./script/FileTransferClient.py")
        FileTransferClient.send(IP)

        FileTransferClient.on("message", (message) => {
            console.log("from python" + message)
            if (message == "Connected") {
                document.getElementById("sendstatus").style.background = "#1FFF00"
                document.getElementById("sendstatus").style.borderColor = "#1FFF00"
                document.getElementById("Fsection2btn2").disabled = false
            }
        })

        FileTransferClient.end((err) => {
            if (err) {
                dialog.showErrorBox("Try connecting again", "Check for correct ID\nRemote host not found :(")
                throw err
            }
        })
    }
    else {
        dialog.showErrorBox("Empty feild or incorrect format of data", "input box only allows digits of minimum length of 1 or maximum length of 10")
    }
})


//This code is for termination of running receiving script(server) when user leaves the tab
document.getElementById("sendfilebtn").addEventListener("click", () => {
    if (warningflag == 1) {
        i = dialog.showMessageBoxSync({ title: "Warning", type: "warning", buttons: ["Yes, Please", "No, Stay"], message: "This action will resulting in termination of receiving process. Do you still want to proceed?" })
        if (i == 0) {
            FileTransferServer.kill()
            document.getElementById("receivestatus").style.background = "red"
            document.getElementById("receivestatus").style.borderColor = "red"
            document.getElementById("Fsection3btn1").disabled = false
            warningflag = 0
        }
        else {
            $("#Fsection3").show(0, () => {
                $("#Fsection2").hide(0)
            })
        }
    }
})

// document.getElementById("RemoteControl").addEventListener("click", () => {
//     FileTransferServer.kill()
//     document.getElementById("receivestatus").style.background = "red"
//     document.getElementById("receivestatus").style.borderColor = "red"
// })


//this code is for sending files to the server or on who is receiving
document.getElementById("Fsection2btn3").addEventListener("click", () => {

    SendFiles = new PythonShell("./script/SendFiles.py")
    SendFiles.send(filepath)

    SendFiles.on("message", (message) => {

        if (message == "Sendmsg") {
            i = dialog.showMessageBox({ type: "info", title: "Sending", message: "Preparing to send files please wait....", detail: "Sharing will start automatically donot close your application." })
            document.getElementById("sendprogress").removeAttribute("value")
        }

        else if (message == "ConnectionError") {
            dialog.showErrorBox("Remote Connection got closed. Try connecting again", "Something went wrong!!!! :(")
            document.getElementById("sendstatus").style.background = "red"
            document.getElementById("sendstatus").style.borderColor = "red"
            document.getElementById("dropzone").style.background = "white"
            document.getElementById("Fsection2btn3").disabled = true
            document.getElementById("Fsection2btn2").disabled = true
            document.getElementById("sendprogress").value = "0"

            FileTransferClient.kill()
        }

        else if (message == "FileSizeError") {
            dialog.showErrorBox("File Size Error", "Files to big to be shared, must be less than 500 mb")
        }

        else if (message == "done") {
            i = dialog.showMessageBoxSync({ type: "info", title: "Status", message: "Files sent successfully !!" })
            document.getElementById("sendstatus").style.background = "red"
            document.getElementById("sendstatus").style.borderColor = "red"
            document.getElementById("Fsection2btn2label").innerHTML = "no files selected"
            document.getElementById("Fsection2btn3").disabled = true
            document.getElementById("Fsection2btn2").disabled = true
            document.getElementById("sendprogress").value = "0"
            FileTransferClient.kill()
        }
        else if (message != null) {
            console.log(message)
            try {
                document.getElementById("sendprogress").value = message
            } catch (error) {
            }

        }
    })

    SendFiles.end((err) => {
        if (err) throw err
    })
})

document.getElementById("dropzone").addEventListener("drop", (event) => {

    var files = event.dataTransfer.files
    var filepath = []
    for (i = 0; i < files.length; i++) {
        console.log(files[i].path)
        x = filepath.push(String(files[i].path))
    }
    console.log(filepath)
    SendFiles = new PythonShell("./script/SendFiles.py")
    SendFiles.send(filepath)

    SendFiles.on("message", (message) => {
        console.log(message)
        if (message == "done") {
            i = dialog.showMessageBoxSync({ type: "info", title: "Status", message: "Files sent successfully !!" })
            document.getElementById("sendstatus").style.background = "red"
            document.getElementById("sendstatus").style.borderColor = "red"
            document.getElementById("dropzone").style.background = "white"
            document.getElementById("Fsection2btn3").disabled = true
            document.getElementById("Fsection2btn2").disabled = true
            document.getElementById("sendprogress").value = "0"

            FileTransferClient.kill()
        }

        else if (message == "Sendmsg") {
            i = dialog.showMessageBox({ type: "info", title: "Sending", message: "Preparing to send files please wait...." })
            document.getElementById("sendprogress").removeAttribute("value")
        }

        else if (message == "ConnectionError") {
            dialog.showErrorBox("Remote Connection got closed.Try connecting Again", "Something went wrong!!!! :(")
            document.getElementById("sendstatus").style.background = "red"
            document.getElementById("sendstatus").style.borderColor = "red"
            document.getElementById("dropzone").style.background = "white"
            document.getElementById("Fsection2btn3").disabled = true
            document.getElementById("Fsection2btn2").disabled = true
            document.getElementById("sendprogress").value = "0"

            FileTransferClient.kill()
        }

        else if (message == "FileSizeError") {
            dialog.showErrorBox("File Size Error", "Files to big to be shared, must be less than 500 mb")
        }

        else if (message != null) {
            console.log(message)
            try {
                document.getElementById("sendprogress").value = message
            } catch (error) {
            }

        }
    })

    SendFiles.end((err) => {
        if (err) throw err
    })
})


//this code is resposible for saving the received files to specified folder
document.getElementById("Fsection3btn2").addEventListener("click", () => {
    path = dialog.showOpenDialogSync({ buttonLabel: "Save", properties: ["openDirectory"], title: "Save", message: "Choose a folder to save your files" })
    document.getElementById("receiveprogress").removeAttribute("value")
    if (path != undefined) {
        Save = new PythonShell("./script/Save.py")
        Save.send(path)

        Save.on("message", (message) => {
            console.log(message)
            if (message == "Savingmsg") {
                i = dialog.showMessageBox({ type: "info", title: "Status", message: "Saving your files please wait a moment donot close your Application" })
            }

            else if (message == "finished") {
                i = dialog.showMessageBoxSync({ type: "info", title: "Status", message: "Files Saved successfully !!" })
                document.getElementById("receivestatus").style.background = "red"
                document.getElementById("receivestatus").style.borderColor = "red"
                document.getElementById("receiveprogress").value = "0"
                FileTransferServer.kill()
                document.getElementById("Fsection3btn1").disabled = false
            }
        })

        Save.end((err) => {
            if (err) throw err
        })
    }
})