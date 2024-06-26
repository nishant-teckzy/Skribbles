/**
*@Author Nishant Tiwari
*Implementation of JWKS routes
*
**/
const express = require('express');
const router  = express.Router(); 
const {showMenu, doLogin, joinRoom, createRoom, newRoom} = require('../controllers/login.controller'); 
router.get('/', showMenu);
//router.post('/', doLogin);

router.get('/joinRoom', joinRoom);
router.post('/room', doLogin);
router.get('/createRoom', createRoom);
router.post('/newRoom', newRoom)
module.exports = router;
