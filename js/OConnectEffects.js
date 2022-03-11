const $ = require("jquery")
const python = require("python-shell")
const PythonShell = python.PythonShell


PythonShell.run("./script/IP_PORT_ID.py", null, (err, message) => {
    if (err) {
        throw err
    }

    //console.log(message)
    document.getElementById("Fsection3input").value = message[0]
    document.getElementById("yourID1").value = message[0]
    document.getElementById("Password1").value = message[1]

})


//main buttons effect in header
document.getElementById("RemoteControl").addEventListener("mouseenter", () => {
    document.getElementById("RemoteControl").style.background = "#3966D4"
    document.getElementById("label1").style.background = "#3966D4"
})
document.getElementById("RemoteControl").addEventListener("mouseleave", () => {
    document.getElementById("RemoteControl").style.background = "#0055D4"
    document.getElementById("label1").style.background = "#0055D4"
})
document.getElementById("FileTransfer").addEventListener("mouseenter", () => {
    document.getElementById("FileTransfer").style.background = "#3966D4"
    document.getElementById("label2").style.background = "#3966D4"
})
document.getElementById("FileTransfer").addEventListener("mouseleave", () => {
    document.getElementById("FileTransfer").style.background = "#0055D4"
    document.getElementById("label2").style.background = "#0055D4"
})





//remote control buttons effect
document.getElementById("section1btn").addEventListener("mouseenter", () => {
    document.getElementById("section1btn").style.background = "#3966D4"
})
document.getElementById("section1btn").addEventListener("mouseleave", () => {
    document.getElementById("section1btn").style.background = "#0055D4"
})

document.getElementById("section2btn").addEventListener("mouseenter", () => {
    document.getElementById("section2btn").style.background = "#3966D4"
})
document.getElementById("section2btn").addEventListener("mouseleave", () => {
    document.getElementById("section2btn").style.background = "#0055D4"
})





// filetransfer buttons effect
document.getElementById("sendfilebtn").addEventListener("mouseenter", () => {
    document.getElementById("sendfilebtn").style.background = "#3966D4"
    document.getElementById("sendbtnlabel").style.background = "#3966D4"
})
document.getElementById("sendfilebtn").addEventListener("mouseleave", () => {
    document.getElementById("sendfilebtn").style.background = "#0055D4"
    document.getElementById("sendbtnlabel").style.background = "#0055D4"
})

document.getElementById("recvfilebtn").addEventListener("mouseenter", () => {
    document.getElementById("recvfilebtn").style.background = "#3966D4"
    document.getElementById("recvbtnlabel").style.background = "#3966D4"
})
document.getElementById("recvfilebtn").addEventListener("mouseleave", () => {
    document.getElementById("recvfilebtn").style.background = "#0055D4"
    document.getElementById("recvbtnlabel").style.background = "#0055D4"
})




//Remote control to file transfer transition and vice versa
document.getElementById("FileTransfer").addEventListener("click", () => {
    $("#container1").hide(0, () => {
        $("#container2").show(0)
    })
})
document.getElementById("RemoteControl").addEventListener("click", () => {
    $("#container2").hide(0, () => {
        $("#container1").show(0)
    })
})

document.getElementById("label1").addEventListener("click", () => {
    $("#container1").hide(0, () => {
        $("#container2").show(0)
    })
})
document.getElementById("label2").addEventListener("click", () => {
    $("#container2").hide(0, () => {
        $("#container1").show(0)
    })
})

//sedfile to recv file transition and vice versa
document.getElementById("sendfilebtn").addEventListener("click", () => {
    $("#Fsection3").hide(0, () => {
        $("#Fsection2").show(0)
    })
})

document.getElementById("recvfilebtn").addEventListener("click", () => {
    $("#Fsection2").hide(0, () => {
        $("#Fsection3").show(0)
    })
})




//File transfer send and recev option button effects

document.getElementById("Fsection2btn1").addEventListener("mouseenter", () => {
    document.getElementById("Fsection2btn1").style.background = "#3966D4"
})

document.getElementById("Fsection2btn1").addEventListener("mouseleave", () => {
    document.getElementById("Fsection2btn1").style.background = "#0055D4"
})

document.getElementById("Fsection2btn2").addEventListener("mouseenter", () => {
    document.getElementById("Fsection2btn2").style.background = "#3966D4"
})

document.getElementById("Fsection2btn2").addEventListener("mouseleave", () => {
    document.getElementById("Fsection2btn2").style.background = "#0055D4"
})

document.getElementById("Fsection2btn3").addEventListener("mouseenter", () => {
    document.getElementById("Fsection2btn3").style.background = "#3966D4"
})

document.getElementById("Fsection2btn3").addEventListener("mouseleave", () => {
    document.getElementById("Fsection2btn3").style.background = "#0055D4"
})

document.getElementById("Fsection3btn1").addEventListener("mouseenter", () => {
    document.getElementById("Fsection3btn1").style.background = "#3966D4"
})
document.getElementById("Fsection3btn1").addEventListener("mouseleave", () => {
    document.getElementById("Fsection3btn1").style.background = "#0055D4"
})

document.getElementById("Fsection3btn2").addEventListener("mouseenter", () => {
    document.getElementById("Fsection3btn2").style.background = "#3966D4"
})
document.getElementById("Fsection3btn2").addEventListener("mouseleave", () => {
    document.getElementById("Fsection3btn2").style.background = "#0055D4"
})



//dropzone effects

document.getElementById("dropzone").addEventListener("dragenter", () => {
    document.getElementById("dropzone").style.borderColor = "black"
})

document.getElementById("dropzone").addEventListener("dragleave", () => {
    document.getElementById("dropzone").style.borderColor = "dimgray"
})

document.getElementById("dropzonetext").addEventListener("dragenter", () => {
    document.getElementById("dropzonetext").style.borderColor = "black"
})

document.getElementById("dropzonetext").addEventListener("dragleave", () => {
    document.getElementById("dropzonetext").style.borderColor = "dimgray"
})

document.getElementById("dropzone").addEventListener("dragover", (event) => {
    event.preventDefault()
})

document.getElementById("dropzone").addEventListener("drop", (event) => {
    event.preventDefault()
    document.getElementById("dropzone").style.background = "#C0D9FC"
    console.log(event.dataTransfer.files)
})