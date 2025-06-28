const express = require('express');

const UserController = require('../controllers/user.controller');

const UserRouter = express.Router();

UserRouter.get("/me", UserController.getCurrentUser);
UserRouter.get("/:username", UserController.getUser);
UserRouter.patch("/:username", UserController.updateUser);
UserRouter.patch("/:username/change-password", UserController.changePassword);
UserRouter.post("/:username/follow", UserController.followUser);
UserRouter.post("/:username/unfollow", UserController.unfollowUser);
UserRouter.delete("/:username", UserController.deleteUser);
UserRouter.get("/search", UserController.searchUsers);

module.exports = UserRouter;
