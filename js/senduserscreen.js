dialog = require("electron").remote.dialog
SendScreen = new PythonShell("./script/SendScreen.py")

SendScreen.on("message", (msg) => {
    if ("Connection Error" == msg) {
        dialog.showMessageBoxSync({type:"info",title:"Remote Connection got Closed.", message: "If the termination was unexpected restart the application if not kindly ignore this message"})
        remote.getCurrentWindow().close()
        SendScreen.end((err)=>{
            if (err) throw err
        })
    }
    else{
        console.log(msg)
    }
})