const jwt = require('jsonwebtoken');
require('dotenv').config();

const User = require('../models/user.model');

const SECRET_KEY = process.env.SECRET_KEY;

const generateToken = (user) => {
    const payload = { id: user._id, email: user.email };
    return jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' });
};

module.exports.login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    try {
        const user = await User.findOne({ email });
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const token = generateToken(user);
        res.cookie('token', token, { httpOnly: true, secure: true });
        res.status(200).json({ message: 'Login successful' });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

module.exports.register = async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ message: 'Username, email, and password are required' });
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: 'User already exists' });
        }

        const user = new User({ username, email, password });
        await user.save();

        const token = generateToken(user);
        res.cookie('token', token, { httpOnly: true, secure: true });
        res.status(201).json({ message: 'Registration successful' });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

module.exports.logout = async (req, res) => {
    res.clearCookie('token');
    res.status(200).json({ message: 'Logged out successfully' });
};

