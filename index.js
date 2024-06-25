const express = require("express");
const app = express();
const fs = require("fs");
const bodyParser = require("body-parser");
const router = require('./routes/login.routes');
const server = require('http').createServer(app)
const { socketConnection } = require('./controllers/websocket.server.controller');
socketConnection(server);
const wsroutes = require('./routes/ws.routes');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use("/scribble", express.static('public'));
//app.use("/",router);
app.use("/scribble",router);
//app.ws("/",wsroutes);

server.listen(process.env.PORT, async function (err) {
  if (err) console.error(err);
  console.error("Server listening on PORT", process.env.PORT);
});
