const rooms = {};

const userSocketMap = new Map();

function onUserRegistration(arg,callback){
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

  userSocketMap.set(arg.id, this.id);

  if(admin){
    callback({status:"200"});
  }else{
    callback({gameStarted:rooms[lobby].game_started});
    this.server.to(this.room_id).emit("player_joined",arg.username);
  }
  
}

function onUserDisconnect(e){

}
/*
function onGameStart(arg){
  if(!rooms.hasOwnProperty(this.room_id)){
    console.error("Invalid User,User room doesnt exist");
  }

  rooms[this.room_id].game_started = true;

}*/

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
      console.error(`Room ${roomId} not found.`);
      return;
    }
    console.log("Room Round Length: ",room.rounds);
    for (let i = 0; i < room.rounds; i++) {

      server.to(roomId).emit('updateMessage', { round: i + 1, type: "roundUpdate" });
      
      for (let j = 0; j < room.users.length; j++) {
        const currentPlayer = room.users[j];

        if (!currentPlayer) {
          console.error(`Current player not found in room ${roomId}.`);
          return;
        }

        const currentPlayerSocketId = userSocketMap.get(currentPlayer.uid);

        // Enable drawing for the current player only
        if (currentPlayerSocketId && server.sockets.sockets.get(currentPlayerSocketId)) {
          server.sockets.sockets.get(currentPlayerSocketId).emit('enableDrawing', true);
        } else {
          console.error(`Socket for user ${currentPlayer.uid} not found.`);
        }

        // Disable drawing for all other players
        room.users.forEach(user => {
          if (user.uid !== currentPlayer.uid) {
            const userSocketId = userSocketMap.get(user.uid);
            if (userSocketId && server.sockets.sockets.get(userSocketId)) {
              server.sockets.sockets.get(userSocketId).emit('enableDrawing', false);
            } else {
              console.error(`Socket for user ${user.uid} not found.`);
            }
          }
        });

        server.to(roomId).emit('updateTimer', { timeLeft: 25 });

        // Wait for 25 seconds for the current player's turn
        await new Promise(resolve => setTimeout(resolve, 25000));

        // Disable drawing for the current player after their turn
        if (currentPlayerSocketId && server.sockets.sockets.get(currentPlayerSocketId)) {
          server.sockets.sockets.get(currentPlayerSocketId).emit('enableDrawing', false);
        }

        //Checking if this is the last User then don't emit the event
        if(j+1 != room.users.length) {
          server.to(roomId).emit('updateMessage', { round: 0, type: "userTurn" });
        
          // Pause for 10 seconds before the next player's turn
          console.log(`Pausing for 10 seconds before the next player's turn`);
          
          await new Promise(resolve => setTimeout(resolve, 10000));
        }
          



      }

      server.to(roomId).emit('updateMessage', { round: i+2, type: "newRound" });


      console.log(`Pausing for 10 seconds before next round`);
      await new Promise(resolve => setTimeout(resolve, 10000));
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
    ,onClearCanvas,
    onGameStart, rooms};