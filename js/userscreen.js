const dialog = require("electron").remote.dialog

RecvRemoteScreen = new PythonShell("./script/RecvRemoteScreen.py")

//Some error handling in case something goes wrong
RecvRemoteScreen.on("message", (msg) => {
    if (msg == "ConnectionError") {
        dialog.showMessageBoxSync({ type: "info", title: "Remote Connection got Closed.", message: "If the termination was unexpected restart the application if not kindly ignore this message" })
        remote.getCurrentWindow().close()
        RecvRemoteScreen.end((err) => {
            if (err) throw err
        })
    }
    else{
        console.log(msg)
    }
})

/* The below code is for displaying the received image on the browserwindow i mean on canvas of course.Why we donot use 
image tag/object because when you load the source it flickers and when the image data is not received it leaves that 
unpleasent alt image which ruins the user experience, hence I used the canvas which uses the PC's GPU for drawing Images using 
drawImage() method */

/* When you draw the received image form the file on to canvas it makes it blur (I mean blur on unexceptable level).
But this is solved by using the dpi (density per inch). What I did is took dpi ratio and scaled the canvas so that the image is 
clear */

dpiratio = window.devicePixelRatio //this returns the windows dpiratio
canvas = document.getElementById("workarea")
ctx = canvas.getContext("2d") //since we are working with 2d image getting context of 2dcanvas 

cw = +getComputedStyle(canvas).getPropertyValue("width").slice(0, -2) //getting the property value of width of canvas
ch = +getComputedStyle(canvas).getPropertyValue("height").slice(0, -2) //getting - - - - heigth of canvas 
//the precceded + sign converts the result to integer since we need to multiply
//setting new scaled attribute
canvas.setAttribute("width", cw * dpiratio)
canvas.setAttribute("height", ch * dpiratio)

image = new Image() //creating the Image Object which similar to img tag instead of using createElement() of document object

/* Now the below code actually does the job of drawing the image since we are displaying image from the file we need to 
regulary display the data from the image file (thats how i get the screen of remote PC). The image object is loaded you need to draw the image.
onload is an event here which occurs once the image object is loaded

setInterval reloads the img src property after every 100 miliseconds 
now when you notice that there is Date object there, that is just for making new string query.
What happens is your browserwindow have a chache memory when it founds that the url is same (even though the data inside has been updated) it do not bother to reload the image
so to reload the image continusly we use the date object and when browser gets the new url it loads the new image
*/
image.onload=()=>{
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height)
}
image.src="./connection.png"

window.setTimeout(()=>{
    window.setInterval(() => {
        image.onload = () => {
            ctx.drawImage(image, 0, 0, canvas.width, canvas.height)
        }
        image.src = "./remotescreen.png?" + new Date().valueOf()
    }, 100)
},4000)


document.getElementById("msgboxhidebtn").addEventListener("click", () => {
    $("#msgbox").slideUp(500)
})

//sending movemove details to python script as text input
document.getElementById("workarea").addEventListener("mousemove", (event) => {
    try {
        moved=true
        RecvRemoteScreen.send("mousemove " + (event.clientX/canvas.width) + " " + (event.clientY/canvas.height) + " " + 0)
    }catch{
    }    
})

//sending moveclick details to python script as text input
document.getElementById("workarea").addEventListener("mousedown", (event) => {
    try {
        RecvRemoteScreen.send("mouseclick " + (event.clientX / canvas.width) + " " + (event.clientY / canvas.height) + " " + event.which)    
    } catch{  
    }    
})

//sending keypress details to python script as text input
document.body.addEventListener("keydown", (event) => {
    switch(event.key){
        case " ":
            RecvRemoteScreen.send("keypress " + 0 + " " + 0 + " " + "space")
            break;

        case "ArrowUp":
            RecvRemoteScreen.send("keypress " + 0 + " " + 0 + " " + "up")
            break;

        case "ArrowDown":
            RecvRemoteScreen.send("keypress " + 0 + " " + 0 + " " + "down")
            break;

        case "ArrowLeft":
            RecvRemoteScreen.send("keypress " + 0 + " " + 0 + " " + "left")
            break;

        case "ArrowRight":
            RecvRemoteScreen.send("keypress " + 0 + " " + 0 + " " + "right")
            break;

        default:
            RecvRemoteScreen.send("keypress " + 0 + " " + 0 + " " + event.key)
            break;
    }          
})