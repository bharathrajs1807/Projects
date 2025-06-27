const express = require('express');

const AuthController = require('../controllers/auth.controller');

const AuthRouter = express.Router();

AuthRouter.post("/sign-up", AuthController.signUp);
AuthRouter.post("/log-in", AuthController.logIn);
AuthRouter.post("/log-out", AuthController.logOut);
AuthRouter.post("/refresh", AuthController.refreshToken);

module.exports = AuthRouter;
