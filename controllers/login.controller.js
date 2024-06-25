/**
*@Author Nishant Tiwari
*Implementation of JWKS controller
*
**/
const { saveUser } = require('../controllers/websocket.server.controller');
const crypto = require('crypto');

const joinRoom = (req, res, next) => {
	res.render('login');
}

const login = (req, res, next) => {
	res.render('menu');
};
const doLogin = (req, res, next) => {
	//console.log(req.body);
	let buff = crypto.randomBytes(6);
	 let uid =  buff.toString('hex');
	 let admin = !(req.body.lobby.trim());
	 //console.log("isadmin",admin);

		saveUser(req.body.name,uid,admin,req.body.lobby);
	 
	 
	 
	//  if(req.body.lobby.trim())
	 res.render("index",{username:req.body.name, id:uid, lobby:req.body.lobby,"admin":admin});
	// else
	// res.render("index",{username:req.body.name,id:uid,lobby:"","admin":admin});
	  
};

module.exports = {login,doLogin,joinRoom};
