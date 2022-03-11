console.log("OConnect")

const electron=require("electron")
const app=electron.app
const BrowserWindow=electron.BrowserWindow
const Menu=electron.Menu
const fs=require("fs")
// const path=require("path")
// const url=require("url")

let win=undefined

function createWindow(){

    win=new BrowserWindow(
        {
            show:false,
            resizable:false,
            icon:"./images/OConnect.ico",
            backgroundColor:"#ffffff",
            //height:580,
            // useContentSize:true,
            webPreferences:{
                nodeIntegration:true
            }
        }
    )

    //Menu.setApplicationMenu(null)
    win.loadFile("./html/OConnect.html")
    
    //Menu.setApplicationMenu(null) //removes default application menu

    win.once("ready-to-show",()=>{  // this is done so that flickers of html file is stopped the app will load html after its html is completely loaded
        win.show()
    })


    win.on("closed",() => {        //On window closed event app should quit
        try {
            fs.unlinkSync("./remoteid.txt", (err) => {
                if (err) {
                    console.error(err)
                }
            })
        } catch {
            
        }
        app.quit()
    })
}

app.on("ready",createWindow)

