const express = require('express');

const PostController = require('../controllers/post.controller');

const PostRouter = express.Router();

// Post CRUD
PostRouter.get("/", PostController.getPosts);
PostRouter.post("/", PostController.createPost);
PostRouter.get("/:postId", PostController.getPost);
PostRouter.patch("/:postId", PostController.updatePost);
PostRouter.delete("/:postId", PostController.deletePost);

// Reactions
PostRouter.post("/:postId/like", PostController.likePost);
PostRouter.post("/:postId/unlike", PostController.unlikePost);
PostRouter.post("/:postId/dislike", PostController.dislikePost);
PostRouter.post("/:postId/undislike", PostController.undislikePost);

// Comments
PostRouter.post("/:postId/comments", PostController.addComment);
PostRouter.patch("/:postId/comments/:commentId", PostController.editComment);
PostRouter.delete("/:postId/comments/:commentId", PostController.deleteComment);

// Replies
PostRouter.post("/:postId/comments/:commentId/replies", PostController.addReply);
PostRouter.patch("/:postId/comments/:commentId/replies/:replyId", PostController.editReply);
PostRouter.delete("/:postId/comments/:commentId/replies/:replyId", PostController.deleteReply);

// Wall
PostRouter.get("/wall", PostController.getWallPosts);

module.exports = PostRouter;
