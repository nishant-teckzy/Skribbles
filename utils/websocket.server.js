let io;
const crypto = require('crypto');
const rooms = {};
exports.socketConnection = (server) => {
  io = require('socket.io')(server);
  io.on('connection', (socket) => {
    console.info(`connected Socket [id=${socket.id}]`);
   // socket.join(socket.request._query.id);
   socket.on("register", (arg) => {
    console.log(arg,rooms);
    
    if(!arg.id || !rooms.hasOwnProperty(arg.id)){
      //callback({status:"unknown_user"});
      console.log("FAILED!!!");
      socket.disconnect();
    }
    socket.username = arg.username;
    socket.room_id = arg.id;
    socket.join(arg.id);
    
  });

  socket.on("join_lobby", (arg) => {
    console.log("join_lobby",arg,rooms);
    
    if(!arg.lobby || !rooms.hasOwnProperty(arg.lobby)){
      //callback({status:"unknown_user"});
      console.log("FAILED!!!");
      socket.disconnect();
    }
    socket.username = arg.username;
    socket.room_id = arg.lobby;
    socket.join(arg.lobby);
    
  });

  socket.on("startDraw", (offsetX,offsetY) => {
    if(!socket.room_id || !rooms.hasOwnProperty(socket.room_id)){
      //callback({status:"unknown_user"});
      console.log("FAILED!!!");
      socket.disconnect();
    }
    io.to(socket.room_id).emit("startDraw",offsetX,offsetY);
    
  });
  socket.on("draw_stop", (offsetX,offsetY) => {
    
    if(!socket.room_id || !rooms.hasOwnProperty(socket.room_id)){
      //callback({status:"unknown_user"});
      console.log("FAILED!!!");
      socket.disconnect();
    }
    io.to(socket.room_id).emit("draw_stop");
    
  });
  socket.on("drawing", (offsetX,offsetY) => {
    if(!socket.room_id || !rooms.hasOwnProperty(socket.room_id)){
      //callback({status:"unknown_user"});
      console.log("FAILED!!!");
      socket.disconnect();
    }
    io.to(socket.room_id).emit("drawing",offsetX,offsetY);
    
  });

  socket.on("tool_changed", (e) => {
    console.log("tool_changed >> ",e);
    if(!socket.room_id || !rooms.hasOwnProperty(socket.room_id)){
      //callback({status:"unknown_user"});
      console.log("FAILED!!!");
      socket.disconnect();
    }
    io.to(socket.room_id).emit("tool_changed",e);
    
  });

  socket.on("chat_message", (e) => {
    console.log("chat_message >> ",e);
    if(!socket.room_id || !rooms.hasOwnProperty(socket.room_id)){
      //callback({status:"unknown_user"});
      console.log("FAILED!!!");
      socket.disconnect();
    }
    io.to(socket.room_id).emit("chat_message",e,socket.username);
    
  });

  socket.on("color_changed", (e) => {
    console.log("color_changed >> ",e);
    if(!socket.room_id || !rooms.hasOwnProperty(socket.room_id)){
      //callback({status:"unknown_user"});
      console.log("FAILED!!!");
      socket.disconnect();
    }
    io.to(socket.room_id).emit("color_changed",e);
    
  });

  socket.on("brush_slider", (e) => {
    console.log("brush_slider >> ",e);
    if(!socket.room_id || !rooms.hasOwnProperty(socket.room_id)){
      //callback({status:"unknown_user"});
      console.log("FAILED!!!");
      socket.disconnect();
    }
    io.to(socket.room_id).emit("brush_slider",e);
    
  });
  socket.on("clear_canvas", (e) => {
    console.log("clear_canvas >> ",e);
    if(!socket.room_id || !rooms.hasOwnProperty(socket.room_id)){
      //callback({status:"unknown_user"});
      console.log("FAILED!!!");
      socket.disconnect();
    }
    io.to(socket.room_id).emit("clear_canvas");
    
  });



    socket.on('disconnect', () => {
      console.info(`Client disconnected [id=${socket.id}]`);
    });
  });
};

exports.sendMessage = (roomId, key, message) => io.to(roomId).emit(key, message);
exports.saveUser = (name,id) => rooms[id] = id;


exports.getRooms = () => io.sockets.adapter.rooms;