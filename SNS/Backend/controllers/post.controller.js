const User = require('../models/user.model');
const Post = require('../models/post.model');

exports.createPost = async (req, res) => {
    try {
        const post = await Post.create({ content: req.body.content, owner: req.userId });
        const user = await User.findById(req.userId);
        await user.addPost(post._id);

        // Populate owner
        await post.populate('owner', 'username firstName lastName profileImage');

        // Transform to match frontend expectations
        const postObj = post.toObject();
        const transformedPost = {
            ...postObj,
            author: {
                id: postObj.owner._id,
                username: postObj.owner.username,
                firstName: postObj.owner.firstName || '',
                lastName: postObj.owner.lastName || '',
                profileImage: postObj.owner.profileImage
            },
            likesCount: postObj.likes.count,
            commentsCount: postObj.comments ? postObj.comments.length : 0,
            isLiked: req.userId ? postObj.likes.users.some(userId => userId.toString() === req.userId.toString()) : false
        };

        res.status(201).json(transformedPost);
    } catch (err) {
        res.status(500).json({ message: "Error creating post" });
    }
};

exports.getPost = async (req, res) => {
    try {
        const commentSkip = parseInt(req.query.commentSkip) || 0;
        const commentLimit = Math.min(parseInt(req.query.commentLimit) || 10, 100);
        const post = await Post.findById(req.params.postId)
            .populate("owner", "username profileImage")
            .populate("comments.userId", "username profileImage")
            .populate("comments.replies.userId", "username profileImage");
        if (!post) return res.status(404).json({ message: "Post not found" });

        // Paginate comments
        const totalComments = post.comments.length;
        const paginatedComments = post.comments.slice(commentSkip, commentSkip + commentLimit);

        // Transform comments and replies for frontend
        const commentsWithReplies = paginatedComments.map(comment => ({
            ...comment.toObject(),
            userId: comment.userId, // populated
            replies: (comment.replies || []).map(reply => ({
                ...reply.toObject(),
                userId: reply.userId // populated
            }))
        }));

        const postObj = post.toObject();
        postObj.comments = commentsWithReplies;
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
        await Post.findById(req.params.postId).then(post => post.like(req.userId));
        const updatedPost = await Post.findById(req.params.postId);
        await updatedPost.populate("owner", "username profileImage");
        res.status(200).json({
            likesCount: updatedPost.likes.count,
            isLiked: true,
            dislikesCount: updatedPost.dislikes.count,
            isDisliked: false
        });
    } catch {
        res.status(500).json({ message: "Error liking post" });
    }
};

exports.unlikePost = async (req, res) => {
    try {
        await Post.findById(req.params.postId).then(post => post.unlike(req.userId));
        const updatedPost = await Post.findById(req.params.postId);
        await updatedPost.populate("owner", "username profileImage");
        res.status(200).json({
            likesCount: updatedPost.likes.count,
            isLiked: false,
            dislikesCount: updatedPost.dislikes.count,
            isDisliked: false
        });
    } catch {
        res.status(500).json({ message: "Error unliking post" });
    }
};

exports.dislikePost = async (req, res) => {
    try {
        await Post.findById(req.params.postId).then(post => post.dislike(req.userId));
        const updatedPost = await Post.findById(req.params.postId);
        await updatedPost.populate("owner", "username profileImage");
        res.status(200).json({
            dislikesCount: updatedPost.dislikes.count,
            isDisliked: true,
            likesCount: updatedPost.likes.count,
            isLiked: false
        });
    } catch {
        res.status(500).json({ message: "Error disliking post" });
    }
};

exports.undislikePost = async (req, res) => {
    try {
        await Post.findById(req.params.postId).then(post => post.undislike(req.userId));
        const updatedPost = await Post.findById(req.params.postId);
        await updatedPost.populate("owner", "username profileImage");
        res.status(200).json({
            dislikesCount: updatedPost.dislikes.count,
            isDisliked: false,
            likesCount: updatedPost.likes.count,
            isLiked: false
        });
    } catch {
        res.status(500).json({ message: "Error undisliking post" });
    }
};

exports.addComment = async (req, res) => {
    try {
        const post = await Post.findById(req.params.postId);
        if (!post) return res.status(404).json({ message: "Post not found" });
        const comment = await post.addComment(req.userId, req.body.comment);
        await comment.populate('userId', 'username profileImage');
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
    } catch (err) {
        console.error('Error in editComment:', err);
        res.status(500).json({ message: "Error editing comment", error: err.message });
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
    } catch (err) {
        console.error('Error in deleteComment:', err);
        res.status(500).json({ message: "Error deleting comment", error: err.message });
    }
};

exports.addReply = async (req, res) => {
    try {
        const post = await Post.findById(req.params.postId)
            .populate("comments.userId", "username profileImage")
            .populate("comments.replies.userId", "username profileImage");
        if (!post) return res.status(404).json({ message: "Post not found" });
        const comment = post.comments.id(req.params.commentId);
        if (!comment) return res.status(404).json({ message: "Comment not found" });
        comment.replies.push({ userId: req.userId, comment: req.body.comment });
        await post.save();
        const newReply = comment.replies[comment.replies.length - 1];
        await newReply.populate('userId', 'username profileImage');
        res.status(201).json(newReply);
    } catch (err) {
        console.error('Error in addReply:', err);
        res.status(500).json({ message: "Error adding reply", error: err.message });
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
    } catch (err) {
        console.error('Error in editReply:', err);
        res.status(500).json({ message: "Error editing reply", error: err.message });
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
    } catch (err) {
        console.error('Error in deleteReply:', err);
        res.status(500).json({ message: "Error deleting reply", error: err.message });
    }
};

exports.getWallPosts = async (req, res) => {
    try {
        const skip = parseInt(req.query.skip) || 0;
        const limit = Math.min(parseInt(req.query.limit) || 10, 100);
        
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Ensure the user has the following field properly initialized
        if (!user.following) {
            user.following = { users: [], count: 0 };
            await user.save();
        }

        // Get IDs of users followed + self, with defensive programming
        const followingUsers = user.following && user.following.users ? user.following.users : [];
        const userIds = [user._id, ...followingUsers];
        
        let posts;
        try {
            posts = await Post.find({ owner: { $in: userIds } })
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .populate('owner', 'username firstName lastName profileImage');
        } catch (queryError) {
            console.error('Wall posts query failed, falling back to all posts:', queryError);
            // Fallback to all posts if the wall query fails
            posts = await Post.find()
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .populate('owner', 'username firstName lastName profileImage');
        }
        
        // Transform the data to match frontend expectations
        const transformedPosts = posts.map(post => {
            const postObj = post.toObject();
            return {
                ...postObj,
                author: {
                    id: postObj.owner._id,
                    username: postObj.owner.username,
                    firstName: postObj.owner.firstName || '',
                    lastName: postObj.owner.lastName || '',
                    profileImage: postObj.owner.profileImage
                },
                likesCount: postObj.likes.count,
                dislikesCount: postObj.dislikes.count,
                commentsCount: postObj.comments ? postObj.comments.length : 0,
                isLiked: req.userId ? postObj.likes.users.some(userId => userId.toString() === req.userId.toString()) : false,
                isDisliked: req.userId ? postObj.dislikes.users.some(userId => userId.toString() === req.userId.toString()) : false
            };
        });
        
        res.status(200).json(transformedPosts);
    } catch (error) {
        console.error('Error in getWallPosts:', error);
        res.status(500).json({ message: 'Error fetching wall posts' });
    }
};

exports.getPostsByUsername = async (req, res) => {
    try {
        const user = await User.findOne({ username: req.params.username });
        if (!user) return res.status(404).json({ message: "User not found" });

        const posts = await Post.find({ owner: user._id })
            .sort({ createdAt: -1 })
            .populate('owner', 'username firstName lastName profileImage');

        // Transform to match frontend expectations
        const transformedPosts = posts.map(post => {
            const postObj = post.toObject();
            return {
                ...postObj,
                author: {
                    id: postObj.owner._id,
                    username: postObj.owner.username,
                    firstName: postObj.owner.firstName || '',
                    lastName: postObj.owner.lastName || '',
                    profileImage: postObj.owner.profileImage
                },
                likesCount: postObj.likes.count,
                dislikesCount: postObj.dislikes.count,
                commentsCount: postObj.comments ? postObj.comments.length : 0,
                isLiked: req.userId ? postObj.likes.users.some(userId => userId.toString() === req.userId.toString()) : false,
                isDisliked: req.userId ? postObj.dislikes.users.some(userId => userId.toString() === req.userId.toString()) : false
            };
        });

        res.status(200).json(transformedPosts);
    } catch (error) {
        console.error('Error fetching user posts:', error);
        res.status(500).json({ message: "Error fetching user posts" });
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
            .populate('owner', 'username firstName lastName profileImage');

        const transformedPosts = posts.map(post => {
            const postObj = post.toObject();
            return {
                ...postObj,
                author: {
                    id: postObj.owner._id,
                    username: postObj.owner.username,
                    firstName: postObj.owner.firstName || '',
                    lastName: postObj.owner.lastName || '',
                    profileImage: postObj.owner.profileImage
                },
                likesCount: postObj.likes.count,
                dislikesCount: postObj.dislikes.count,
                commentsCount: postObj.comments ? postObj.comments.length : 0,
                isLiked: req.userId ? postObj.likes.users.some(userId => userId.toString() === req.userId.toString()) : false,
                isDisliked: req.userId ? postObj.dislikes.users.some(userId => userId.toString() === req.userId.toString()) : false
            };
        });

        res.status(200).json(transformedPosts);
    } catch {
        res.status(500).json({ message: "Error fetching posts" });
    }
};
