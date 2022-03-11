const remote = require("electron").remote
const PythonShell = require("python-shell").PythonShell


ChattingClient = new PythonShell("./script/ChattingClient.py")

ChattingClient.on("message", (msg) => {
    switch (msg) {
        case "MsgBoxTerminationFromRemote":
            //remote.dialog.showErrorBox("Remote Connection got closed")
            break;

        default:
            console.log(msg)
            p = document.createElement("p")
            p.innerHTML = msg
            p.style.width = "200px"
            p.style.padding = "5px"
            p.style.paddingLeft = "10px"
            p.style.marginTop = "8px"
            p.style.border = "1px solid #79B2FC"
            p.style.borderRadius = "20px"
            p.style.background = "#79B2FC"
            p.style.color = "white"
            p.style.fontFamily = "Arial, Helvetica, sans-serif"
            p.style.cssFloat = "left"
            document.getElementById("msgboxdisplay").appendChild(p)
            display = document.getElementById("msgboxdisplay")
            display.scrollTop = display.scrollHeight
            break;
    }
})

document.getElementById("msgboxsendbtn").addEventListener("click", () => {

    msg = document.getElementById("msgboxinput").value

    if (msg != "") {
        p = document.createElement("p")
        p.innerHTML = msg
        p.style.width = "200px"
        p.style.padding = "5px"
        p.style.paddingLeft = "10px"
        p.style.marginTop = "8px"
        p.style.border = "1px solid #79B2FC"
        p.style.borderRadius = "20px"
        p.style.background = "white"
        p.style.color = "black"
        p.style.fontFamily = "Arial, Helvetica, sans-serif"
        p.style.cssFloat = "right"
        document.getElementById("msgboxdisplay").appendChild(p)
        ChattingClient.send(msg)
        document.getElementById("msgboxinput").value = ""
        display = document.getElementById("msgboxdisplay")
        display.scrollTop=display.scrollHeight
    }
})

document.getElementById("msgboxinput").addEventListener("keypress",(event)=>{
    if (event.which==13) {
        msg = document.getElementById("msgboxinput").value

        if (msg != "") {
            p = document.createElement("p")
            p.innerHTML = msg
            p.style.width = "200px"
            p.style.padding = "5px"
            p.style.paddingLeft = "10px"
            p.style.marginTop = "8px"
            p.style.border = "1px solid #79B2FC"
            p.style.borderRadius = "20px"
            p.style.background = "white"
            p.style.color = "black"
            p.style.fontFamily = "Arial, Helvetica, sans-serif"
            p.style.cssFloat = "right"
            document.getElementById("msgboxdisplay").appendChild(p)
            ChattingClient.send(msg)
            document.getElementById("msgboxinput").value = ""
            display = document.getElementById("msgboxdisplay")
            display.scrollTop = display.scrollHeight
        }
    }
})

remote.getCurrentWindow().on("close", () => {
    ChattingClient.end((err) => {
        if (err) throw err
    })
})



