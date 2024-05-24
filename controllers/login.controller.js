/**
*@Author Nishant Tiwari
*Implementation of JWKS controller
*
**/
const { saveUser } = require('../controllers/websocket.server.controller');
const crypto = require('crypto');
const login = (req, res, next) => {
	res.render('login');
};
const doLogin = (req, res, next) => {
	console.log(req.body);
	let buff = crypto.randomBytes(6);
	 let uid =  buff.toString('hex');
	 saveUser(req.body.name,uid);
	 
	 if(req.body.lobby.trim())
	 res.render("index",{username:req.body.name,id:uid,lobby:req.body.lobby});
	else
	res.render("index",{username:req.body.name,id:uid,lobby:""});
	  
};

module.exports = {login,doLogin};
