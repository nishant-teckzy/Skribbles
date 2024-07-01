const rooms = {};

function onUserRegistration(arg,callback){
  console.log("onUserRegistration:",arg);
  
  let lobby = arg.lobby?arg.lobby:arg.id;
  let admin = false;
  if(arg.id && !arg.lobby){
    admin = true;
    rooms[lobby].admin_id = this.id;
  }
  if(!lobby || !rooms.hasOwnProperty(lobby)){
    //callback({status:"unknown_user"});
    console.log("FAILED!!!");
    this.disconnect();
  }
  this.username = arg.username;
  this.room_id = lobby;
  this.join(lobby);

  rooms[this.room_id].users.find((o, i) => {
    if (o.uname == arg.username && o.uid == arg.id) {
      rooms[this.room_id].users[i].socketId = this.id;
        return true;
    }
});
console.log(rooms[this.room_id].users);
  if(admin){
    callback({status:"200"});
  }else{
    callback({gameStarted:rooms[lobby].game_started});
    this.server.to(this.room_id).emit("player_joined",arg.username);
  }
  
}

function onUserDisconnect(e){

}

function switchTurns(followedBy,roomId){
  if(!followedBy){
    rooms[roomId].users[0].it = true;
    let painterSocket  = this.server.in(rooms[roomId].users[0].socketId).fetchSockets();
    painterSocket.emit("chooseWord","horse,rose,tiger");
    painterSocket.emit("playerChoosing",painterSocket.username);
  }
}

function onGameStart(arg){
  if(!rooms.hasOwnProperty(this.room_id)){
    console.error("Invalid User,User room doesnt exist");
  }

  rooms[this.room_id].game_started = true;
  rooms[this.room_id].round = 1;
  rooms[this.room_id].max_round = 3;
  rooms[this.room_id].users.sort((a, b) => 0.5 - Math.random());
  switchTurns(null,this.room_id);

}

function onWordSelected(arg,callback){
  if(!arg.selectedWord){
    console.error("Selected Word is null or empty");
  }
  if(!rooms.hasOwnProperty(this.room_id)){
    console.error("Invalid User,User room doesnt exist");
  }
  rooms[this.room_id].currentWord = arg.selectedWord;
  callback({status:"200"});

  
}



function onToolChanged(arg){
    console.log("tool_changed >> ",arg);
    if(!this.room_id || !rooms.hasOwnProperty(this.room_id)){
      //callback({status:"unknown_user"});
      console.log("FAILED!!!");
      this.disconnect();
    }
    this.server.to(this.room_id).emit("tool_changed",arg);
}

function onColorChanged(arg){
    console.log("color_changed >> ",arg);
    if(!this.room_id || !rooms.hasOwnProperty(this.room_id)){
      //callback({status:"unknown_user"});
      console.log("FAILED!!!");
      this.disconnect();
    }
    this.server.to(this.room_id).emit("color_changed",arg);
}

function onChatMessageReceived(arg){
    console.log("chat_message >> ",arg);
    if(!this.room_id || !rooms.hasOwnProperty(this.room_id)){
      //callback({status:"unknown_user"});
      console.log("FAILED!!!");
      this.disconnect();
    }
    this.broadcast.to(this.room_id).emit("chat_message",arg,this.username);
}

function onDrawingStart(offsetX,offsetY){
    if(!this.room_id || !rooms.hasOwnProperty(this.room_id)){
        //callback({status:"unknown_user"});
        console.log("FAILED!!!");
        this.disconnect();
      }
      this.server.to(this.room_id).emit("startDraw",offsetX,offsetY);
    
}


function onDrawingStop(arg){
    if(!this.room_id || !rooms.hasOwnProperty(this.room_id)){
        //callback({status:"unknown_user"});
        console.log("FAILED!!!");
        this.disconnect();
      }
      this.server.to(this.room_id).emit("draw_stop");
    
}

function onDrawing(offsetX,offsetY){
    if(!this.room_id || !rooms.hasOwnProperty(this.room_id)){
        //callback({status:"unknown_user"});
        console.log("FAILED!!!");
        this.disconnect();
      }
      this.server.to(this.room_id).emit("drawing",offsetX,offsetY);
}

function onBrushSizeChanged(e){
    console.log("brush_slider >> ",e);
    if(!this.room_id || !rooms.hasOwnProperty(this.room_id)){
      //callback({status:"unknown_user"});
      console.log("FAILED!!!");
      this.disconnect();
    }
    this.server.to(this.room_id).emit("brush_slider",e);
}

function onClearCanvas(e){
    console.log("clear_canvas >> ",e);
    if(!this.room_id || !rooms.hasOwnProperty(this.room_id)){
      //callback({status:"unknown_user"});
      console.log("FAILED!!!");
      this.disconnect();
    }
    this.server.to(this.room_id).emit("clear_canvas");
}

module.exports = {
  onUserRegistration
    ,onDrawingStart
    ,onDrawingStop
    ,onDrawing
    ,onToolChanged
    ,onChatMessageReceived
    ,onColorChanged
    ,onBrushSizeChanged
    ,onGameStart
    ,onWordSelected
    ,onClearCanvas,rooms};