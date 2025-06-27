const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Post = require('./post.model');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: [8, "The password must be at least 8 characters long"]
    },
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    phoneNumber: {
        type: String,
        required: false,
        validate: {
            validator: v => /^\d{10}$/.test(v),
            message: props => `${props.value} should have exactly 10 digits`
        }
    },
    gender: {
        type: String,
        required: false,
        enum: ["male", "female", "others"]
    },
    birthday: {
        type: Date,
        required: false
    },
    bio: {
        type: String,
        required: false,
        maxlength: [1000, "Bio cannot exceed 1000 characters"]
    },
    role: {
        type: String,
        enum: ["admin", "user"],
        default: "user"
    },
    following: {
        users: {
            type: [mongoose.Schema.Types.ObjectId],
            ref: "User",
            default: []
        },
        count: {
            type: Number,
            default: 0,
            immutable: true
        }
    },
    posts: {
        postIds: {
            type: [mongoose.Schema.Types.ObjectId],
            ref: "Post",
            default: []
        },
        count: {
            type: Number,
            default: 0,
            immutable: true
        }
    },
    refreshToken: {
        type: String,
        default: null
    }
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });

userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ username: 1 }, { unique: true });
userSchema.index({ email: 1, username: 1 }, { unique: true });
userSchema.index({ refreshToken: 1 });
userSchema.index({ "following.users": 1 });

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

userSchema.post("deleteOne", { document: true, query: false }, async function () {
    const deletedUserId = this._id;
    // Remove user's posts
    await Post.deleteMany({ owner: deletedUserId });
    // Remove from followers
    const users = await mongoose.model("User").find({ "following.users": deletedUserId });
    for (let user of users) {
        user.following.users = user.following.users.filter(id => !id.equals(deletedUserId));
        user.following.count = user.following.users.length;
        await user.save();
    }
});

userSchema.post("findOneAndDelete", async function (deletedUser) {
    if (!deletedUser) return;
    const deletedUserId = deletedUser._id;
    // Remove user's posts
    await Post.deleteMany({ owner: deletedUserId });
    // Remove from followers
    const users = await mongoose.model("User").find({ "following.users": deletedUserId });
    for (let user of users) {
        user.following.users = user.following.users.filter(id => !id.equals(deletedUserId));
        user.following.count = user.following.users.length;
        await user.save();
    }
});

userSchema.methods.comparePassword = async function (userPassword) {
    return await bcrypt.compare(userPassword, this.password);
}

userSchema.methods.follow = async function (userId) {
    if (this._id.equals(userId)) {
        throw new Error("You cannot follow yourself");
    }
    const alreadyFollowing = this.following.users.some(id => id.equals(userId));
    if (!alreadyFollowing) {
        this.following.users.push(userId);
        this.following.count = this.following.users.length;
        await this.save();
        return true;
    }
    return false;
}

userSchema.methods.unfollow = async function (userId) {
    const wasFollowing = this.following.users.some(id => id.equals(userId));
    if (wasFollowing) {
        this.following.users = this.following.users.filter(id => !id.equals(userId));
        this.following.count = this.following.users.length;
        await this.save();
        return true;
    }
    return false;
}

userSchema.methods.addPost = async function (postId) {
    const alreadyExists = this.posts.postIds.some(id => id.equals(postId));
    if (!alreadyExists) {
        this.posts.postIds.push(postId);
        this.posts.count = this.posts.postIds.length;
        await this.save();
        return true;
    }
    return false;
}

userSchema.methods.removePost = async function (postId) {
    const wasPresent = this.posts.postIds.some(id => id.equals(postId));
    if (wasPresent) {
        this.posts.postIds = this.posts.postIds.filter(id => !id.equals(postId));
        this.posts.count = this.posts.postIds.length;
        await this.save();
        return true;
    }
    return false;
}

userSchema.virtual("fullName").get(function () {
    return `${this.firstName} ${this.lastName}`;
});

const User = mongoose.model("User", userSchema);

module.exports = User;