/** 
*@author Nishant Tiwari
*Intercept Socket Events and Implementation of their Handlers
**/
socket.on("startDraw", startDraw);
socket.on("drawing", drawing);
socket.on("draw_stop", onStopDrawing);
socket.on("tool_changed", onToolChanged);
socket.on("color_changed",onColorChanged);
socket.on("brush_slider",onBrushSliderChanged);
socket.on("chat_message", onChatReceived);
socket.on("clear_canvas",clearCanvas);
