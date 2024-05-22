/**
*@Author Nishant Tiwari
*Implementation of WS routes
*
**/
const express = require('express');
const router  = express.Router(); 

router.get('/echo', function(ws, req) {
    ws.on('message', function(msg) {
      ws.send(msg);
    });
  });

  module.exports = router;