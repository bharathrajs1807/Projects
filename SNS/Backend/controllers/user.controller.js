const bcrypt = require('bcryptjs');

const User = require('../models/user.model');

// GET user by username (public info)
exports.getUser = async (req, res) => {
    try {
        const user = await User.findOne({ username: req.params.username }).select("-password -refreshToken");
        if (!user) return res.status(404).json({ message: "User not found" });

        // Defensive: ensure followers/following are always present
        if (!user.followers) user.followers = { users: [], count: 0 };
        if (!user.following) user.following = { users: [], count: 0 };

        // Determine if the current user follows this profile
        let isFollowing = false;
        if (req.user) {
            const currentUser = await User.findOne({ username: req.user });
            if (currentUser && currentUser.following && Array.isArray(currentUser.following.users)) {
                isFollowing = currentUser.following.users.some(id => id.equals(user._id));
            }
        }

        res.status(200).json({
            ...user.toObject(),
            joinedAt: user.createdAt,
            followers: user.followers,
            following: user.following,
            followersCount: user.followers.count,
            followingCount: user.following.count,
            isFollowing
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

        // Add to following
        const alreadyFollowing = currentUser.following.users.some(id => id.equals(targetUser._id));
        if (!alreadyFollowing) {
            currentUser.following.users.push(targetUser._id);
            currentUser.following.count = currentUser.following.users.length;
            await currentUser.save();
        }

        // Add to followers
        const alreadyFollower = targetUser.followers.users.some(id => id.equals(currentUser._id));
        if (!alreadyFollower) {
            targetUser.followers.users.push(currentUser._id);
            targetUser.followers.count = targetUser.followers.users.length;
            await targetUser.save();
        }

        if (alreadyFollowing) return res.status(400).json({ message: "Already following this user" });

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

        // Remove from following
        const wasFollowing = currentUser.following.users.some(id => id.equals(targetUser._id));
        if (wasFollowing) {
            currentUser.following.users = currentUser.following.users.filter(id => !id.equals(targetUser._id));
            currentUser.following.count = currentUser.following.users.length;
            await currentUser.save();
        }

        // Remove from followers
        const wasFollower = targetUser.followers.users.some(id => id.equals(currentUser._id));
        if (wasFollower) {
            targetUser.followers.users = targetUser.followers.users.filter(id => !id.equals(currentUser._id));
            targetUser.followers.count = targetUser.followers.users.length;
            await targetUser.save();
        }

        if (!wasFollowing) return res.status(400).json({ message: "You are not following this user" });

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

exports.getCurrentUser = async (req, res) => {
    try {
        const user = await User.findById(req.userId).select("-password -refreshToken");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                phoneNumber: user.phoneNumber,
                gender: user.gender,
                birthday: user.birthday,
                bio: user.bio,
                profileImage: user.profileImage,
                following: user.following,
                followers: user.followers,
                posts: user.posts,
                joinedAt: user.createdAt,
                postsCount: user.posts ? user.posts.count : 0,
            }
        });
    } catch (error) {
        console.error("Get current user error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
