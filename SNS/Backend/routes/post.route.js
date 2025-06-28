const express = require('express');
const router = express.Router();
const postController = require('../controllers/post.controller');
const auth = require('../middlewares/auth.middleware');

// Post CRUD
router.get("/", postController.getPosts);
router.post("/", postController.createPost);
router.get("/:postId", postController.getPost);
router.patch("/:postId", postController.updatePost);
router.delete("/:postId", postController.deletePost);

// Reactions
router.post("/:postId/like", postController.likePost);
router.post("/:postId/unlike", postController.unlikePost);
router.post("/:postId/dislike", postController.dislikePost);
router.post("/:postId/undislike", postController.undislikePost);

// Comments
router.post("/:postId/comments", postController.addComment);
router.patch("/:postId/comments/:commentId", postController.editComment);
router.delete("/:postId/comments/:commentId", postController.deleteComment);

// Replies
router.post("/:postId/comments/:commentId/replies", postController.addReply);
router.patch("/:postId/comments/:commentId/replies/:replyId", postController.editReply);
router.delete("/:postId/comments/:commentId/replies/:replyId", postController.deleteReply);

// Wall
router.get("/wall", postController.getWallPosts);
router.get('/user/:username', auth, postController.getPostsByUsername);

module.exports = router;
