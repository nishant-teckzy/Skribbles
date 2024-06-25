/**
*@Author Nishant Tiwari
*Implementation of JWKS routes
*
**/
const express = require('express');
const router  = express.Router(); 
const {login,doLogin,joinRoom} = require('../controllers/login.controller'); 
router.get('/', login);
router.get('/joinRoom', joinRoom);
router.post('/', doLogin);  
module.exports = router;
