const rooms = {};
function onLobbyJoining(arg){
    console.log("join_lobby",arg);
    
    if(!arg.lobby || !rooms.hasOwnProperty(arg.lobby)){
      //callback({status:"unknown_user"});
      console.log("FAILED!!!");
      this.disconnect();
    }
    this.username = arg.username;
    this.room_id = arg.lobby;
    this.join(arg.lobby);

}

function onUserRegistration(arg){
    console.log("join_lobby",this.id);
    console.log(arg,rooms);
    
    if(!arg.id || !rooms.hasOwnProperty(arg.id)){
      //callback({status:"unknown_user"});
      console.log("FAILED!!!");
      this.disconnect();
    }
    this.username = arg.username;
    this.room_id = arg.id;
    this.join(arg.id);
}

function onToolChanged(arg){
    console.log("tool_changed >> ",e);
    if(!this.room_id || !rooms.hasOwnProperty(this.room_id)){
      //callback({status:"unknown_user"});
      console.log("FAILED!!!");
      this.disconnect();
    }
    this.server.to(this.room_id).emit("tool_changed",e);
}

function onColorChanged(arg){
    console.log("color_changed >> ",e);
    if(!this.room_id || !rooms.hasOwnProperty(this.room_id)){
      //callback({status:"unknown_user"});
      console.log("FAILED!!!");
      this.disconnect();
    }
    this.server.to(this.room_id).emit("color_changed",e);
}

function onChatMessageReceived(arg){
    console.log("chat_message >> ",arg);
    if(!this.room_id || !rooms.hasOwnProperty(this.room_id)){
      //callback({status:"unknown_user"});
      console.log("FAILED!!!");
      this.disconnect();
    }
    this.broadcast.to(this.room_id).emit("chat_message",e,this.username);
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
    ,onLobbyJoining
    ,onDrawingStart
    ,onDrawingStop
    ,onDrawing
    ,onToolChanged
    ,onChatMessageReceived
    ,onColorChanged
    ,onBrushSizeChanged
    ,onClearCanvas,rooms};