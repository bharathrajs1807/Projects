const jwt = require('jsonwebtoken');
require('dotenv').config();

const User = require('../models/user.model');

const ACCESS_TOKEN_SECRET_KEY = process.env.ACCESS_TOKEN_SECRET_KEY;
const REFRESH_TOKEN_SECRET_KEY = process.env.REFRESH_TOKEN_SECRET_KEY;

const generateTokens = (username) => {
    const accessToken = jwt.sign({ username }, ACCESS_TOKEN_SECRET_KEY, { expiresIn: "15m" });
    const refreshToken = jwt.sign({ username }, REFRESH_TOKEN_SECRET_KEY, { expiresIn: "7d" });
    return { accessToken, refreshToken };
};

exports.signUp = async (req, res) => {
    try {
        const {
            email, username, password,
            firstName, lastName, phoneNumber,
            gender, birthday, bio
        } = req.body;

        if (!email || !username || !password || !firstName || !lastName) {
            return res.status(400).json({ message: "Required fields missing" });
        }

        if (password.length < 8) {
            return res.status(400).json({ message: "Password must be at least 8 characters" });
        }

        if (phoneNumber && !/^\d{10}$/.test(phoneNumber)) {
            return res.status(400).json({ message: "Phone number must be 10 digits" });
        }

        if (gender && !["male", "female", "others"].includes(gender)) {
            return res.status(400).json({ message: "Invalid gender" });
        }

        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return res.status(409).json({ message: "Email or username already exists" });
        }

        const user = await User.create({
            email,
            username,
            password,
            firstName,
            lastName,
            phoneNumber,
            gender,
            birthday,
            bio
        });

        // Auto-login after signup
        const { accessToken, refreshToken } = generateTokens(user.username);
        user.refreshToken = refreshToken;
        await user.save();

        res.cookie("token", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? "Strict" : "Lax",
            maxAge: 15 * 60 * 1000
        });

        res.status(201).json({
            message: "Successfully signed up",
            refreshToken,
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
                profileImage: user.profileImage
            }
        });
    } catch (error) {
        console.error("Signup error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

exports.logIn = async (req, res) => {
    try {
        const { identifier, password } = req.body;

        if (!identifier || !password) {
            return res.status(400).json({ message: "Email/username and password required" });
        }

        const user = await User.findOne({
            $or: [
                { email: identifier.toLowerCase().trim() },
                { username: identifier.trim() }
            ]
        });

        if (!user || !(await user.comparePassword(password))) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const { accessToken, refreshToken } = generateTokens(user.username);
        user.refreshToken = refreshToken;
        await user.save();

        res.cookie("token", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? "Strict" : "Lax",
            maxAge: 15 * 60 * 1000
        });

        res.status(200).json({
            message: "Login successful",
            refreshToken,
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
                profileImage: user.profileImage
            }
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

exports.logOut = async (req, res) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(400).json({ message: "refreshToken is required" });
        }

        const user = await User.findOne({ refreshToken });
        if (!user) {
            return res.status(404).json({ message: "Invalid refresh token" });
        }

        user.refreshToken = null;
        await user.save();

        res.clearCookie("token");
        res.status(200).json({ message: "Successfully logged out" });
    } catch (error) {
        console.error("Logout error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

exports.refreshToken = async (req, res) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(400).json({ message: "refreshToken is required" });
        }

        const user = await User.findOne({ refreshToken });
        if (!user) {
            return res.status(404).json({ message: "Invalid refresh token" });
        }

        const decoded = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET_KEY);

        if (decoded.username !== user.username) {
            return res.status(403).json({ message: "Invalid refresh token" });
        }

        const { accessToken, refreshToken: newRefreshToken } = generateTokens(decoded.username);
        
        // Update the refresh token in the database
        user.refreshToken = newRefreshToken;
        await user.save();

        res.cookie("token", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? "Strict" : "Lax",
            maxAge: 15 * 60 * 1000
        });

        res.status(200).json({
            message: "Token refreshed",
            refreshToken: newRefreshToken,
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
                profileImage: user.profileImage
            }
        });
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ message: "Refresh token expired. Please log in again" });
        }
        console.error("Refresh error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

exports.getMe = async (req, res) => {
    try {
        const user = await User.findById(req.userId).select('-password -refreshToken');
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
                profileImage: user.profileImage
            }
        });
    } catch (error) {
        console.error("Get me error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
