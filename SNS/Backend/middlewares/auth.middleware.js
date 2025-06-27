const jwt = require('jsonwebtoken');
require('dotenv').config();
const User = require('../models/user.model');

const ACCESS_TOKEN_SECRET_KEY = process.env.ACCESS_TOKEN_SECRET_KEY;

const authMiddleware = async function (req, res, next) {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: "No token provided in cookies" });
    }

    try {
        const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET_KEY);
        req.user = decoded.username;
        // Fetch userId from DB for convenience
        const user = await User.findOne({ username: decoded.username });
        req.userId = user ? user._id : null;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};

module.exports = authMiddleware;
