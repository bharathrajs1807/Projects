const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    comment: {
        type: String,
        required: true,
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    replies: [
        {
            _id: {
                type: mongoose.Schema.Types.ObjectId,
                default: () => new mongoose.Types.ObjectId()
            },
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                required: true
            },
            comment: {
                type: String,
                required: true,
                trim: true
            },
            createdAt: {
                type: Date,
                default: Date.now
            }
        }
    ]
}, { _id: true });

const postSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true,
        trim: true,
        maxlength: [1000, "Caption cannot exceed 1000 characters"]
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    likes: {
        users: {
            type: [mongoose.Schema.Types.ObjectId],
            ref: "User",
            default: []
        },
        count: {
            type: Number,
            default: 0
        }
    },
    dislikes: {
        users: {
            type: [mongoose.Schema.Types.ObjectId],
            ref: "User",
            default: []
        },
        count: {
            type: Number,
            default: 0
        }
    },
    comments: [commentSchema]
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });

postSchema.index({ "likes.users": 1 });
postSchema.index({ "dislikes.users": 1 });

postSchema.methods.like = async function (userId) {
    const alreadyLiked = this.likes.users.some(id => id.equals(userId));
    if (!alreadyLiked) {
        this.dislikes.users = this.dislikes.users.filter(id => !id.equals(userId));
        this.dislikes.count = this.dislikes.users.length;

        this.likes.users.push(userId);
        this.likes.count = this.likes.users.length;
        await this.save();
        return true;
    }
    return false;
};

postSchema.methods.unlike = async function (userId) {
    const wasLiked = this.likes.users.some(id => id.equals(userId));
    if (wasLiked) {
        this.likes.users = this.likes.users.filter(id => !id.equals(userId));
        this.likes.count = this.likes.users.length;
        await this.save();
        return true;
    }
    return false;
};

postSchema.methods.dislike = async function (userId) {
    const alreadyDisliked = this.dislikes.users.some(id => id.equals(userId));
    if (!alreadyDisliked) {
        this.likes.users = this.likes.users.filter(id => !id.equals(userId));
        this.likes.count = this.likes.users.length;

        this.dislikes.users.push(userId);
        this.dislikes.count = this.dislikes.users.length;
        await this.save();
        return true;
    }
    return false;
};

postSchema.methods.undislike = async function (userId) {
    const wasDisliked = this.dislikes.users.some(id => id.equals(userId));
    if (wasDisliked) {
        this.dislikes.users = this.dislikes.users.filter(id => !id.equals(userId));
        this.dislikes.count = this.dislikes.users.length;
        await this.save();
        return true;
    }
    return false;
};

postSchema.methods.addComment = async function (userId, text) {
    this.comments.push({ userId, comment: text });
    await this.save();
    return this.comments[this.comments.length - 1];
};

postSchema.methods.deleteComment = async function (commentId) {
    this.comments = this.comments.filter(comment => !comment._id.equals(commentId));
    await this.save();
    return true;
};

postSchema.methods.editComment = async function (commentId, newText) {
    const comment = this.comments.id(commentId);
    if (!comment) throw new Error("Comment not found");
    comment.comment = newText;
    await this.save();
    return comment;
};

postSchema.methods.addReply = async function (commentId, userId, text) {
    const parentComment = this.comments.id(commentId);
    if (!parentComment) throw new Error("Comment not found");

    parentComment.replies.push({ userId, comment: text });
    await this.save();
    return parentComment.replies[parentComment.replies.length - 1];
};

postSchema.methods.deleteReply = async function (commentId, replyId) {
    const parentComment = this.comments.id(commentId);
    if (!parentComment) throw new Error("Comment not found");

    parentComment.replies = parentComment.replies.filter(reply => !reply._id.equals(replyId));
    await this.save();
    return true;
};

postSchema.methods.editReply = async function (commentId, replyId, newText) {
    const comment = this.comments.id(commentId);
    if (!comment) throw new Error("Comment not found");

    const reply = comment.replies.id(replyId);
    if (!reply) throw new Error("Reply not found");

    reply.comment = newText;
    await this.save();
    return reply;
};

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
