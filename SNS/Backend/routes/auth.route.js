const express = require('express');

const AuthController = require('../controllers/auth.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const AuthRouter = express.Router();

AuthRouter.post("/sign-up", AuthController.signUp);
AuthRouter.post("/log-in", AuthController.logIn);
AuthRouter.post("/log-out", AuthController.logOut);
AuthRouter.post("/refresh", AuthController.refreshToken);
AuthRouter.get("/me", authMiddleware, AuthController.getMe);

module.exports = AuthRouter;
