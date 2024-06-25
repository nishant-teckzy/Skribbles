const canvas = document.querySelector("canvas"),
socket = io(),
defaultDP = "data:image/png;base64, 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";
toolBtns = document.querySelectorAll(".tool"),
fillColor = document.querySelector("#fill-color"),
sizeSlider = document.querySelector("#size-slider"),
colorBtns = document.querySelectorAll(".colors input[type=radio]"),
colorPicker = document.querySelector("#color-picker"),
clearCanvasElement = document.querySelector(".clear-canvas"),
saveImg = document.querySelector(".save-img"),
ctx = canvas.getContext("2d", {
    willReadFrequently: true
});

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

const drawRect = (offsetX, offsetY) => {
    // if fillColor isn't checked draw a rect with border else draw rect with background
    if (!fillColor.checked) {
        // creating circle according to the mouse pointer
        return ctx.strokeRect(offsetX, offsetY, prevMouseX - offsetX, prevMouseY - offsetY);
    }
    ctx.fillRect(offsetX, offsetY, prevMouseX - offsetX, prevMouseY - offsetY);
}

const drawCircle = (offsetX, offsetY) => {
    ctx.beginPath(); // creating new path to draw circle
    // getting radius for circle according to the mouse pointer
    let radius = Math.sqrt(Math.pow((prevMouseX - offsetX), 2) + Math.pow((prevMouseY - offsetY), 2));
    ctx.arc(prevMouseX, prevMouseY, radius, 0, 2 * Math.PI); // creating circle according to the mouse pointer
    fillColor.checked ? ctx.fill() : ctx.stroke(); // if fillColor is checked fill circle else draw border circle
}

const drawTriangle = (offsetX, offsetY) => {
    ctx.beginPath(); // creating new path to draw circle
    ctx.moveTo(prevMouseX, prevMouseY); // moving triangle to the mouse pointer
    ctx.lineTo(offsetX, offsetY); // creating first line according to the mouse pointer
    ctx.lineTo(prevMouseX * 2 - offsetX, offsetY); // creating bottom line of triangle
    ctx.closePath(); // closing path of a triangle so the third line draw automatically
    fillColor.checked ? ctx.fill() : ctx.stroke(); // if fillColor is checked fill triangle else draw border
}

const startDraw = (offsetX, offsetY) => {

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

const drawing = (offsetX, offsetY) => {

    if (!isDrawing)
        return; // if isDrawing is false return from here
    ctx.putImageData(snapshot, 0, 0); // adding copied canvas data on to this canvas

    if (selectedTool === "brush" || selectedTool === "eraser") {
        // if selected tool is eraser then set strokeStyle to white
        // to paint white color on to the existing canvas content else set the stroke color to selected color
        ctx.strokeStyle = selectedTool === "eraser" ? "#fff" : selectedColor;
        ctx.lineTo(offsetX, offsetY); // creating line according to the mouse pointer
        ctx.stroke(); // drawing/filling line with color
    } else if (selectedTool === "rectangle") {
        drawRect(offsetX, offsetY);
    } else if (selectedTool === "circle") {
        drawCircle(offsetX, offsetY);
    } else {
        drawTriangle(offsetX, offsetY);
    }
}

function onToolChanged(selected_Tool) {
    document.querySelector(".options .active").classList.remove("active");
    document.getElementById(selected_Tool).classList.add("active");
    selectedTool = selected_Tool;
}
function onColorChanged(selected_Color) {
    document.querySelector(".colors input[type=radio]:checked").checked = false;
    const p = [...document.querySelectorAll(".colors label span")].find(
        (ele) => window.getComputedStyle(ele).backgroundColor === selected_Color);
    if (p) {
        document.querySelector("#" + p.classList[0]).checked = true;
        $(".color-picker").css({
            border: "",
            transform: ""
        });
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
function onBrushSliderChanged(sizeSlider_value) {
    brushWidth = sizeSlider_value;
}
function onChatReceived(message, user) {
    if (message && user) {
        var msg = $("<div/>", {
            class: "text-left"
        })
            .append(
                $("<h6/>", {
                    class: "text-muted"
                }).append($("<small/>").text(user)))
            .append($("<div/>", {
                    class: "p-1 text-secondary"
                }).text(message));
        $(".chat-body").append(msg);
    }
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setCanvasBackground();
}

function onStopDrawing() {
    isDrawing = false;
}

function onPlayerJoined(username) {
    let playerimg = $("<span/>", {
        class: "font-weight-bold"
    }).append($("<img/>", {
                src: defaultDP,
                class: "rounded-circle",
                width: "50",
                height: "50"
            }), username);
    let cancel_icon = $("<span/>", ).append($("<i/>", {
                class: "text-primary material-symbols-outlined",
                style: "vertical-align: middle; cursor: pointer; font-size:25px;"
            }).text("cancel"))
        let item = $('<li />', {
            class: "list-group-item d-flex justify-content-between align-items-center"
        }).append(playerimg, cancel_icon);
    item.appendTo("#player_list");
}

toolBtns.forEach(btn => {
    if (!lobby) {
        btn.addEventListener("click", () => {
            socket.emit("tool_changed", btn.id);
        });
    }
});

sizeSlider.addEventListener("change", () => {
    socket.emit("brush_slider", sizeSlider.value)
});

colorBtns.forEach(btn => {
    $(btn).change(function () {
        if ($(this).is(':checked')) {
            let bgColor = $(this).next('label').children().css("background-color");
            socket.emit("color_changed", bgColor);
        }
    });
});

colorPicker.addEventListener("change", () => {
    $(".color-picker").css("background-color", colorPicker.value);
    socket.emit("color_changed", colorPicker.value);
});

clearCanvasElement.addEventListener("click", () => {
    socket.emit("clear_canvas");
});

saveImg.addEventListener("click", () => {
    const link = document.createElement("a"); // creating <a> element
    link.download = `${Date.now()}.jpg`; // passing current date as link download value
    link.href = canvas.toDataURL(); // passing canvasData as link href value
    link.click(); // clicking link to download image
});

$(document).ready(function () {

    $("#chat-form").submit(function (e) {
        e.preventDefault();
        let fields = $(this).serializeArray();
        console.error(fields[0]);
        if (fields[0].value)

            var msg = $("<div/>", {
                class: "text-right mb-2"
            })
                .append($("<h6/>", {
                        class: "text-muted"
                    }).append($("<small/>").text(uname)))
                .append($("<div/>", {
                        class: "p-1 text-secondary"
                    }).text(fields[0].value));

        $(".chat-body").append(msg);

        socket.emit("chat_message", fields[0].value);
    });

})

socket.emit("register", {
    "username": uname,
    "id": uid,
    "lobby": lobby
}, (res) => {
    if (res.gameStarted) {
        $("#myModal").modal({
            show: false
        });
    }
});
canvas.addEventListener("mousedown", (e) => {
    socket.emit("startDraw", e.offsetX, e.offsetY)
});
canvas.addEventListener("mousemove", (e) => {
    socket.emit("drawing", e.offsetX, e.offsetY)
});
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

/**
 * @author arunSharma
 * @description Implementing the Players turn-by-turn code.
 */

socket.on('startGame', (data) => {

    console.log("Game Started --> ", data);
    $('#myModal').modal('hide');
    let countdown = 5;
    const countdownInterval = setInterval(() => {
        if (countdown > 0) {
            $('#timer').text(`Game Starts in ${countdown} seconds`);
            countdown--;
        } else {
            clearInterval(countdownInterval);
        }
    }, 1000);
});

socket.on('enableDrawing', (data) => {
    console.log("Enable Drawing: ", data);
    var drawingCanvas = document.getElementById('drawingCanvas');
    if (data) {
        drawingCanvas.style.pointerEvents = 'auto'; // Enable drawing canvas
    } else {
        drawingCanvas.style.pointerEvents = 'none'; // Disable drawing canvas
    }
});

socket.on('updateTimer', function (data) {
    $('#timer').text(data.timeLeft);
    startCountdown(data.timeLeft);
});

function startCountdown(duration) {
    let timeLeft = duration;

    const timerInterval = setInterval(() => {
      timeLeft -= 1;
      $('#timer').text(timeLeft);

      if (timeLeft <= 0) {
        clearInterval(timerInterval);
      }
    }, 1000);
  }



  socket.on('updateMessage', function (data) {

    if(data.type == "userTurn") {

        let countdown = 10;
        const countdownInterval = setInterval(() => {
            if (countdown > 0) {
                $('#timer').text(`New Player Turn Starts in ${countdown} seconds`);
                countdown--;
            } else {
                clearInterval(countdownInterval);
            }
        }, 1000);

    } else if(data.type == "newRound") {

        let countdown = 10;
        const countdownInterval = setInterval(() => {
        if (countdown > 0) {
            $('#timer').text(`Round ${data.round} Starts in ${countdown} seconds`);
            countdown--;
        } else {
            clearInterval(countdownInterval);
        }
    }, 1000);

    }

  });



//Emit Start Game Event to every one once the game starts//
document.getElementById('startGameButton').addEventListener('click', () => {
    socket.emit('startGame');
});

/*--------------------------End Code----------------------------*/

window.openSideDrawer = openSideDrawer;
window.closeSideDrawer = closeSideDrawer;
