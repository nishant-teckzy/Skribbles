const canvas = document.querySelector("canvas"),
socket = io(),
toolBtns = document.querySelectorAll(".tool"),
fillColor = document.querySelector("#fill-color"),
sizeSlider = document.querySelector("#size-slider"),
colorBtns = document.querySelectorAll(".colors input[type=radio]"),
colorPicker = document.querySelector("#color-picker"),
clearCanvasElement = document.querySelector(".clear-canvas"),
saveImg = document.querySelector(".save-img"),
ctx = canvas.getContext("2d",{ willReadFrequently: true });

// global variables with default value
let prevMouseX, prevMouseY, snapshot,
isDrawing = false,
selectedTool = "brush",
brushWidth = 5,
selectedColor = "#000";


function copyToClipboard(element) {
    var $temp = $("<input>");
    $("body").append($temp);
    $temp.val($(element).text()).select();
    document.execCommand("copy");
    $temp.remove();
  }

const setCanvasBackground = () => {
    // setting whole canvas background to white, so the downloaded img background will be white
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = selectedColor; // setting fillstyle back to the selectedColor, it'll be the brush color
}

window.addEventListener("load", () => {
    // setting canvas width/height.. offsetwidth/height returns viewable width/height of an element
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    setCanvasBackground();
});

const drawRect = (offsetX,offsetY) => {
    // if fillColor isn't checked draw a rect with border else draw rect with background
    if(!fillColor.checked) {
        // creating circle according to the mouse pointer
        return ctx.strokeRect(offsetX, offsetY, prevMouseX - offsetX, prevMouseY - offsetY);
    }
    ctx.fillRect(offsetX, offsetY, prevMouseX - offsetX, prevMouseY - offsetY);
}

const drawCircle = (offsetX,offsetY) => {
    ctx.beginPath(); // creating new path to draw circle
    // getting radius for circle according to the mouse pointer
    let radius = Math.sqrt(Math.pow((prevMouseX - offsetX), 2) + Math.pow((prevMouseY - offsetY), 2));
    ctx.arc(prevMouseX, prevMouseY, radius, 0, 2 * Math.PI); // creating circle according to the mouse pointer
    fillColor.checked ? ctx.fill() : ctx.stroke(); // if fillColor is checked fill circle else draw border circle
}

const drawTriangle = (offsetX,offsetY) => {
    ctx.beginPath(); // creating new path to draw circle
    ctx.moveTo(prevMouseX, prevMouseY); // moving triangle to the mouse pointer
    ctx.lineTo(offsetX, offsetY); // creating first line according to the mouse pointer
    ctx.lineTo(prevMouseX * 2 - offsetX, offsetY); // creating bottom line of triangle
    ctx.closePath(); // closing path of a triangle so the third line draw automatically
    fillColor.checked ? ctx.fill() : ctx.stroke(); // if fillColor is checked fill triangle else draw border
}

const startDraw = (offsetX,offsetY) => {
   
    isDrawing = true;
    prevMouseX = offsetX; // passing current mouseX position as prevMouseX value
    prevMouseY = offsetY; // passing current mouseY position as prevMouseY value
    ctx.beginPath(); // creating new path to draw
    ctx.lineWidth = brushWidth; // passing brushSize as line width
    ctx.strokeStyle = selectedColor; // passing selectedColor as stroke style
    ctx.fillStyle = selectedColor; // passing selectedColor as fill style
    // copying canvas data & passing as snapshot value.. this avoids dragging the image
    snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
}

const drawing = (offsetX,offsetY) => {
    
    if(!isDrawing) return; // if isDrawing is false return from here
    ctx.putImageData(snapshot, 0, 0); // adding copied canvas data on to this canvas

    if(selectedTool === "brush" || selectedTool === "eraser") {
        // if selected tool is eraser then set strokeStyle to white 
        // to paint white color on to the existing canvas content else set the stroke color to selected color
        ctx.strokeStyle = selectedTool === "eraser" ? "#fff" : selectedColor;
        ctx.lineTo(offsetX, offsetY); // creating line according to the mouse pointer
        ctx.stroke(); // drawing/filling line with color
    } else if(selectedTool === "rectangle"){
        drawRect(offsetX,offsetY);
    } else if(selectedTool === "circle"){
        drawCircle(offsetX,offsetY);
    } else {
        drawTriangle(offsetX,offsetY);
    }
}

function onToolChanged(selected_Tool){
    document.querySelector(".options .active").classList.remove("active");
    document.getElementById(selected_Tool).classList.add("active");
    selectedTool = selected_Tool;
}
function onColorChanged(selected_Color){
    document.querySelector(".colors input[type=radio]:checked").checked = false;
    const p = [...document.querySelectorAll(".colors label span")].find(
      (ele) => window.getComputedStyle(ele).backgroundColor === selected_Color
    );
    if (p) {
      document.querySelector("#" + p.classList[0]).checked = true;
      $(".color-picker").css({ border: "", transform: "" });
    } else {
      $(".color-picker").css({
        "background-color": selected_Color,
        border: "2px solid black",
        transform: "scale(1.25)",
      });
      colorPicker.style.background = selectedColor;
    }
    selectedColor = selected_Color;
}
function onBrushSliderChanged(sizeSlider_value){
    brushWidth = sizeSlider_value;
}
function onChatReceived(message,user){
    if (message && user) {
        var msg = $("<div/>", { class: "text-left" })
          .append(
            $("<h6/>", { class: "text-muted" }).append($("<small/>").text(user))
          )
          .append($("<div/>", { class: "p-1 text-secondary" }).text(message));
        $(".chat-body").append(msg);
      }
}

function clearCanvas(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setCanvasBackground();
}

function onStopDrawing(){
    isDrawing = false;
}


toolBtns.forEach(btn => {
    if(!lobby){
        btn.addEventListener("click", () => { 
        socket.emit("tool_changed",btn.id);
    });}
});

sizeSlider.addEventListener("change", () => {socket.emit("brush_slider",sizeSlider.value)}); 

colorBtns.forEach(btn => {
    $(btn).change(function() {
        if ($(this).is(':checked')) {
            let bgColor= $(this).next('label').children().css("background-color");
            socket.emit("color_changed",bgColor);
        }
    });
});

colorPicker.addEventListener("change", () => {
    $(".color-picker").css("background-color", colorPicker.value);
    socket.emit("color_changed",colorPicker.value);
});

clearCanvasElement.addEventListener("click", () => {socket.emit("clear_canvas")});

saveImg.addEventListener("click", () => {
    const link = document.createElement("a"); // creating <a> element
    link.download = `${Date.now()}.jpg`; // passing current date as link download value
    link.href = canvas.toDataURL(); // passing canvasData as link href value
    link.click(); // clicking link to download image
});

$(document).ready(function(){

    $("#chat-form").submit(function(e){
        e.preventDefault();
        let fields = $(this).serializeArray();
        console.error(fields[0]);
        if(fields[0].value)
        
        var msg = $("<div/>",{class:"text-right mb-2"})
		.append($("<h6/>",{class:"text-muted"}).append($("<small/>").text("Nishant")))
		.append($("<div/>",{class:"p-1 text-secondary"}).text(fields[0].value));

        $(".chat-body").append(msg);

        socket.emit("chat_message",fields[0].value);
    });

})

socket.emit("register",{"username":uname,"id":uid});
if(lobby.trim()){
    socket.emit("join_lobby",{"username":uname,"id":uid,"lobby":lobby});
}
canvas.addEventListener("mousedown",(e)=>{socket.emit("startDraw",e.offsetX, e.offsetY)});
canvas.addEventListener("mousemove", (e)=>{socket.emit("drawing",e.offsetX, e.offsetY)});
canvas.addEventListener("mouseup", () => socket.emit("draw_stop"));



//Drawe Methods
function openSideDrawer() {
    document.getElementById("side-drawer").style.left = "0";
    document.getElementById("side-drawer-void").classList.add("d-block");
    document.getElementById("side-drawer-void").classList.remove("d-none");
  }
  
  function closeSideDrawer() {
    document.getElementById("side-drawer").style.left = "-336px";
    document.getElementById("side-drawer-void").classList.add("d-none");
    document.getElementById("side-drawer-void").classList.remove("d-block");
  }
  
  window.openSideDrawer = openSideDrawer;
  window.closeSideDrawer = closeSideDrawer;
  