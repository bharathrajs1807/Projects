const bcrypt = require('bcryptjs');

const User = require('../models/user.model');

// GET user by username (public info)
exports.getUser = async (req, res) => {
    try {
        const user = await User.findOne({ username: req.params.username }).select("-password -refreshToken");
        if (!user) return res.status(404).json({ message: "User not found" });
        const followersCount = await User.countDocuments({ 'following.users': user._id });
        res.status(200).json({
            ...user.toObject(),
            followersCount
        });
    } catch (err) {
        console.error("Get user error:", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// PATCH update user (email or username)
exports.updateUser = async (req, res) => {
    try {
        if (req.params.username !== req.user) {
            return res.status(403).json({ message: "Unauthorized" });
        }

        const user = await User.findOne({ username: req.params.username });
        if (!user) return res.status(404).json({ message: "User not found" });

        const { username, email, firstName, lastName, phoneNumber, gender, birthday, bio } = req.body;

        if (username && username !== user.username) {
            const exists = await User.findOne({ username });
            if (exists) return res.status(400).json({ message: "Username already taken" });
            user.username = username;
        }

        if (email && email !== user.email) {
            const exists = await User.findOne({ email });
            if (exists) return res.status(400).json({ message: "Email already taken" });
            user.email = email;
        }

        if (firstName) user.firstName = firstName;
        if (lastName) user.lastName = lastName;
        if (phoneNumber) user.phoneNumber = phoneNumber;
        if (gender) user.gender = gender;
        if (birthday) user.birthday = birthday;
        if (bio) user.bio = bio;

        await user.save();
        res.status(200).json({ message: "User updated successfully" });
    } catch (err) {
        console.error("Update user error:", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// PATCH change password
exports.changePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;
        if (!oldPassword || !newPassword) {
            return res.status(400).json({ message: "Old and new password required" });
        }

        const user = await User.findOne({ username: req.params.username });
        if (!user || !(await user.comparePassword(oldPassword))) {
            return res.status(400).json({ message: "Invalid old password" });
        }

        if (newPassword.length < 8) {
            return res.status(400).json({ message: "Password must be at least 8 characters" });
        }

        user.password = newPassword;
        await user.save();
        res.status(200).json({ message: "Password changed successfully" });
    } catch (err) {
        console.error("Change password error:", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// POST follow user
exports.followUser = async (req, res) => {
    try {
        const currentUser = await User.findOne({ username: req.user });
        const targetUser = await User.findOne({ username: req.params.username });

        if (!currentUser || !targetUser) return res.status(404).json({ message: "User not found" });
        if (currentUser._id.equals(targetUser._id)) return res.status(400).json({ message: "You can't follow yourself" });

        const followed = await currentUser.follow(targetUser._id);
        if (!followed) return res.status(400).json({ message: "Already following this user" });

        res.status(200).json({ message: `Followed ${targetUser.username}` });
    } catch (err) {
        console.error("Follow user error:", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// POST unfollow user
exports.unfollowUser = async (req, res) => {
    try {
        const currentUser = await User.findOne({ username: req.user });
        const targetUser = await User.findOne({ username: req.params.username });

        if (!currentUser || !targetUser) return res.status(404).json({ message: "User not found" });

        const unfollowed = await currentUser.unfollow(targetUser._id);
        if (!unfollowed) return res.status(400).json({ message: "You are not following this user" });

        res.status(200).json({ message: `Unfollowed ${targetUser.username}` });
    } catch (err) {
        console.error("Unfollow user error:", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// DELETE delete user
exports.deleteUser = async (req, res) => {
    try {
        if (req.params.username !== req.user) {
            return res.status(403).json({ message: "Unauthorized" });
        }

        const user = await User.findOne({ username: req.params.username });
        if (!user) return res.status(404).json({ message: "User not found" });

        await user.deleteOne(); // Will trigger post-delete middleware to clean up followers
        res.status(200).json({ message: "User deleted successfully" });
    } catch (err) {
        console.error("Delete user error:", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

exports.searchUsers = async (req, res) => {
    try {
        const query = req.query.query || '';
        if (!query.trim()) {
            return res.status(400).json({ message: 'Query parameter is required' });
        }
        // Search by username or full name (case-insensitive, partial match)
        const regex = new RegExp(query, 'i');
        const users = await User.find({
            $or: [
                { username: regex },
                { firstName: regex },
                { lastName: regex },
                { $expr: { $regexMatch: { input: { $concat: ["$firstName", " ", "$lastName"] }, regex: query, options: "i" } } }
            ]
        }).select('username firstName lastName fullName');
        res.status(200).json(users);
    } catch (err) {
        console.error('Search users error:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
