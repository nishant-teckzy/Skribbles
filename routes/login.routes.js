/**
*@Author Nishant Tiwari
*Implementation of JWKS routes
*
**/
const express = require('express');
const router  = express.Router(); 
const loginController = require('../controllers/login.controller'); 
router.get('/', loginController.login);  
router.post('/', loginController.doLogin);  
module.exports = router;
