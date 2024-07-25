const rooms = {};


function onUserRegistration(arg,callback) {
  //console.log("onUserRegistration:",arg);
  //console.log(arg,rooms);
  let lobby = arg.lobby?arg.lobby:arg.id

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
  }else {
    callback({gameStarted:rooms[lobby].game_started});
    this.server.to(this.room_id).emit("player_joined",arg.username);
  }
  
}


function onUserDisconnect(e) {

}

function switchTurns(followedBy,roomId){
  if(!followedBy){
    rooms[roomId].users[0].it = true;
    let painterSocket  = this.server.in(rooms[roomId].users[0].socketId).fetchSockets();
    painterSocket.emit("chooseWord","horse,rose,tiger");
    painterSocket.emit("playerChoosing",painterSocket.username);
  }
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
    //console.log("tool_changed >> ",arg);
    if(!this.room_id || !rooms.hasOwnProperty(this.room_id)){
      //callback({status:"unknown_user"});
      console.log("FAILED!!!");
      this.disconnect();
    }
    this.server.to(this.room_id).emit("tool_changed",arg);
}

function onColorChanged(arg){
    //console.log("color_changed >> ",arg);
    if(!this.room_id || !rooms.hasOwnProperty(this.room_id)){
      //callback({status:"unknown_user"});
      console.log("FAILED!!!");
      this.disconnect();
    }
    this.server.to(this.room_id).emit("color_changed",arg);
}

function onChatMessageReceived(arg){
    //console.log("chat_message >> ",arg);
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
    //console.log("brush_slider >> ",e);
    if(!this.room_id || !rooms.hasOwnProperty(this.room_id)){
      //callback({status:"unknown_user"});
      console.log("FAILED!!!");
      this.disconnect();
    }
    this.server.to(this.room_id).emit("brush_slider",e);
}

function onClearCanvas(e){
    //console.log("clear_canvas >> ",e);
    if(!this.room_id || !rooms.hasOwnProperty(this.room_id)){
      //callback({status:"unknown_user"});
      console.log("FAILED!!!");
      this.disconnect();
    }
    this.server.to(this.room_id).emit("clear_canvas");
}

// New Code Added by Arun Sharma for the Game Start Event and handle the player's turn one by one.

function closeLobbyModal(e) {

  console.log("Printing E ---> ", e);
  this.server.to(this.room_id).emit('closeLobbyModal');

}

function onGameStart(arg) {
  if (!rooms.hasOwnProperty(this.room_id)) {
    console.error("Invalid User, User room doesn't exist");
    return;
  }

  rooms[this.room_id].game_started = true;
  //rooms[this.room_id].currentTurn = 0;
  this.server.to(this.room_id).emit('startGame', 0);

  setTimeout(() => {
    startTurn(this.room_id, this.server);
  }, 5000);

}
  async function startTurn(roomId, server) {
    try {
      const room = rooms[roomId];
      if (!room) {
        return;
      }
  
      const wait = (time) => new Promise(resolve => setTimeout(resolve, time));
  
      for (let roundIndex = 0; roundIndex < room.rounds; roundIndex++) {
  
        server.to(roomId).emit('updateMessage', { round: roundIndex + 1, type: "roundUpdate" });
  
        for (let [userIndex, currentPlayer] of room.users.entries()) {
          if (!currentPlayer) {
            console.error(`Current player not found in room ${roomId}.`);
            return;
          }
  
          if (currentPlayer.socketId) {
            server.to(currentPlayer.socketId).emit('enableDrawing', true);
          } else {
            console.error(`Socket for user ${currentPlayer.uid} not found.`);
          }
  
          room.users
            .filter(user => user.uid !== currentPlayer.uid)
            .forEach(user => {
              if (user.socketId) {
                server.to(user.socketId).emit('enableDrawing', false);
              } else {
                console.error(`Socket for user ${user.uid} not found.`);
              }
            });
  
          server.to(roomId).emit('updateTimer', { timeLeft: 25 });
  
          await wait(25000);
  
          if (currentPlayer.socketId) {
            server.to(currentPlayer.socketId).emit('enableDrawing', false);
          }
  
          if (userIndex + 1 !== room.users.length) {
            server.to(roomId).emit('updateMessage', { round: 0, type: "userTurn" });
            await wait(10000);
          }
        }
  
        server.to(roomId).emit('updateMessage', { round: roundIndex + 2, type: "newRound" });
        await wait(10000);
      }
  
    } catch (error) {
      console.error('Error in startTurn function:', error);
    }
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
    ,onClearCanvas
    ,onGameStart
    ,onWordSelected
    ,onClearCanvas
    ,closeLobbyModal
    ,rooms};
