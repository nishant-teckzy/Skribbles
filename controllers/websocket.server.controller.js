let io;
const crypto = require('crypto');
const wsHandler = require('../service/websocket.evt.handler');

exports.socketConnection = (server) => {
  io = require('socket.io')(server);
  io.on('connection', (socket) => {
  console.info(`connected Socket [id=${socket.id}]`);
 // console.log("IO >> ",io);
   // socket.join(socket.request._query.id);
  socket.on("register", wsHandler.onUserRegistration);
  socket.on("join_lobby",wsHandler.onLobbyJoining);
  socket.on("startDraw",wsHandler.onDrawingStart);
  socket.on("draw_stop",wsHandler.onDrawingStop);
  socket.on("drawing", wsHandler.onDrawing);
  socket.on("tool_changed", wsHandler.onToolChanged);
  socket.on("chat_message", wsHandler.onChatMessageReceived);
  socket.on("color_changed",wsHandler.onColorChanged);
  socket.on("brush_slider", wsHandler.onBrushSizeChanged);
  socket.on("clear_canvas",wsHandler.onClearCanvas);

    socket.on('disconnect', () => {
      console.info(`Client disconnected [id=${socket.id}]`);
    });
  });
};

exports.sendMessage = (roomId, key, message) => io.to(roomId).emit(key, message);
exports.saveUser = (name,id,admin) => wsHandler.rooms[id] = {"uid":id,"uname":name,"is_admin":admin};


exports.getRooms = () => io.sockets.adapter.rooms;