const User = require('../models/user.model');
const Post = require('../models/post.model');

exports.createPost = async (req, res) => {
    try {
        const post = await Post.create({ content: req.body.content, owner: req.userId });
        const user = await User.findOne({ username: req.user });
        await user.addPost(post._id);
        res.status(201).json(post);
    } catch (err) {
        res.status(500).json({ message: "Error creating post" });
    }
};

exports.getPosts = async (req, res) => {
    try {
        const skip = parseInt(req.query.skip) || 0;
        const limit = Math.min(parseInt(req.query.limit) || 10, 100);
        const posts = await Post.find()
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate("owner", "username")
            .select("-comments"); // Exclude comments for list view
        res.status(200).json(posts);
    } catch {
        res.status(500).json({ message: "Error fetching posts" });
    }
};

exports.getPost = async (req, res) => {
    try {
        const commentSkip = parseInt(req.query.commentSkip) || 0;
        const commentLimit = Math.min(parseInt(req.query.commentLimit) || 10, 100);
        const post = await Post.findById(req.params.postId)
            .populate("comments.userId", "username")
            .populate("comments.replies.userId", "username")
            .populate("owner", "username");
        if (!post) return res.status(404).json({ message: "Post not found" });
        // Paginate comments
        const totalComments = post.comments.length;
        const paginatedComments = post.comments.slice(commentSkip, commentSkip + commentLimit);
        const postObj = post.toObject();
        postObj.comments = paginatedComments;
        postObj.totalComments = totalComments;
        res.status(200).json(postObj);
    } catch {
        res.status(500).json({ message: "Error getting post" });
    }
};

exports.updatePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.postId);
        if (!post) return res.status(404).json({ message: "Post not found" });
        if (!post.owner.equals(req.userId)) return res.status(403).json({ message: "Unauthorized: Only the post owner can update this post" });
        post.content = req.body.content;
        await post.save();
        res.status(200).json(post);
    } catch {
        res.status(500).json({ message: "Error updating post" });
    }
};

exports.deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.postId);
        if (!post) return res.status(404).json({ message: "Post not found" });
        if (!post.owner.equals(req.userId)) return res.status(403).json({ message: "Unauthorized: Only the post owner can delete this post" });
        await Post.findByIdAndDelete(req.params.postId);
        const user = await User.findOne({ username: req.user });
        await user.removePost(post._id);
        res.status(200).json({ message: "Post deleted" });
    } catch {
        res.status(500).json({ message: "Error deleting post" });
    }
};

exports.likePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.postId);
        await post.like(req.userId);
        res.status(200).json({ message: "Liked post" });
    } catch {
        res.status(500).json({ message: "Error liking post" });
    }
};

exports.unlikePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.postId);
        await post.unlike(req.userId);
        res.status(200).json({ message: "Unliked post" });
    } catch {
        res.status(500).json({ message: "Error unliking post" });
    }
};

exports.dislikePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.postId);
        await post.dislike(req.userId);
        res.status(200).json({ message: "Disliked post" });
    } catch {
        res.status(500).json({ message: "Error disliking post" });
    }
};

exports.undislikePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.postId);
        await post.undislike(req.userId);
        res.status(200).json({ message: "Removed dislike" });
    } catch {
        res.status(500).json({ message: "Error undisliking post" });
    }
};

exports.addComment = async (req, res) => {
    try {
        const post = await Post.findById(req.params.postId);
        if (!post) return res.status(404).json({ message: "Post not found" });
        const comment = await post.addComment(req.userId, req.body.comment);
        res.status(201).json(comment);
    } catch {
        res.status(500).json({ message: "Error adding comment" });
    }
};

exports.editComment = async (req, res) => {
    try {
        const post = await Post.findById(req.params.postId);
        if (!post) return res.status(404).json({ message: "Post not found" });
        const comment = post.comments.id(req.params.commentId);
        if (!comment) return res.status(404).json({ message: "Comment not found" });
        if (!comment.userId.equals(req.userId)) return res.status(403).json({ message: "Unauthorized: Only the comment owner can edit this comment" });
        comment.comment = req.body.comment;
        await post.save();
        res.status(200).json(comment);
    } catch {
        res.status(500).json({ message: "Error editing comment" });
    }
};

exports.deleteComment = async (req, res) => {
    try {
        const post = await Post.findById(req.params.postId);
        if (!post) return res.status(404).json({ message: "Post not found" });
        const comment = post.comments.id(req.params.commentId);
        if (!comment) return res.status(404).json({ message: "Comment not found" });
        if (!comment.userId.equals(req.userId) && !post.owner.equals(req.userId)) {
            return res.status(403).json({ message: "Unauthorized: Only the comment owner or post owner can delete this comment" });
        }
        comment.remove();
        await post.save();
        res.status(200).json({ message: "Comment deleted" });
    } catch {
        res.status(500).json({ message: "Error deleting comment" });
    }
};

exports.addReply = async (req, res) => {
    try {
        const post = await Post.findById(req.params.postId);
        if (!post) return res.status(404).json({ message: "Post not found" });
        const comment = post.comments.id(req.params.commentId);
        if (!comment) return res.status(404).json({ message: "Comment not found" });
        comment.replies.push({ userId: req.userId, comment: req.body.comment });
        await post.save();
        res.status(201).json(comment.replies[comment.replies.length - 1]);
    } catch {
        res.status(500).json({ message: "Error adding reply" });
    }
};

exports.editReply = async (req, res) => {
    try {
        const post = await Post.findById(req.params.postId);
        if (!post) return res.status(404).json({ message: "Post not found" });
        const comment = post.comments.id(req.params.commentId);
        if (!comment) return res.status(404).json({ message: "Comment not found" });
        const reply = comment.replies.id(req.params.replyId);
        if (!reply) return res.status(404).json({ message: "Reply not found" });
        if (!reply.userId.equals(req.userId)) return res.status(403).json({ message: "Unauthorized: Only the reply owner can edit this reply" });
        reply.comment = req.body.comment;
        await post.save();
        res.status(200).json(reply);
    } catch {
        res.status(500).json({ message: "Error editing reply" });
    }
};

exports.deleteReply = async (req, res) => {
    try {
        const post = await Post.findById(req.params.postId);
        if (!post) return res.status(404).json({ message: "Post not found" });
        const comment = post.comments.id(req.params.commentId);
        if (!comment) return res.status(404).json({ message: "Comment not found" });
        const reply = comment.replies.id(req.params.replyId);
        if (!reply) return res.status(404).json({ message: "Reply not found" });
        if (!reply.userId.equals(req.userId)) return res.status(403).json({ message: "Unauthorized: Only the reply owner can delete this reply" });
        reply.remove();
        await post.save();
        res.status(200).json({ message: "Reply deleted" });
    } catch {
        res.status(500).json({ message: "Error deleting reply" });
    }
};

exports.getWallPosts = async (req, res) => {
    try {
        const skip = parseInt(req.query.skip) || 0;
        const limit = Math.min(parseInt(req.query.limit) || 10, 100);
        const user = await User.findById(req.userId);
        if (!user) return res.status(404).json({ message: 'User not found' });
        // Get IDs of users followed + self
        const userIds = [user._id, ...user.following.users];
        const posts = await Post.find({ owner: { $in: userIds } })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate('owner', 'username')
            .select('-comments');
        res.status(200).json(posts);
    } catch {
        res.status(500).json({ message: 'Error fetching wall posts' });
    }
};
