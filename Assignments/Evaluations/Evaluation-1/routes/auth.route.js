const express = require('express');
const AuthController = require('../controllers/auth.controller');

const AuthRouter = express.Router();

AuthRouter.post('/login', AuthController.login);
AuthRouter.post('/register', AuthController.register);
AuthRouter.post('/logout', AuthController.logout);

module.exports = AuthRouter;
