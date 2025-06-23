const mongoose = require('mongoose');
const { Socket } = require('socket.io');

const userSchema = new mongoose.Schema({
    username: String,
    socketId: String
});

const User = new mongoose.model("User", userSchema);

module.exports = User;