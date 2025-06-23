const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const path = require('path');

const connectDB = require('./config/database');
const User = require('./models/user.model');

const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer, { cors: { origin: '*' } });

app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname)));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

const rooms = {};

io.on('connection', (socket) => {
    let currentRoom = null;
    let username = null;

    socket.on('join-room', async ({ room, user }) => {
        currentRoom = room;
        username = user;
        socket.join(room);
        if (!rooms[room]) rooms[room] = { users: {}, code: '', cursors: {} };
        rooms[room].users[socket.id] = user;
        try {
            const existingUser = await User.findOne({ username: user });
            if (existingUser) {
                existingUser.socketId = socket.id;
                await existingUser.save();
            } else {
                await User.create({ username: user, socketId: socket.id });
            }
        } catch (err) {
            console.error('Error saving/updating user in DB:', err);
        }
        socket.emit('init', { code: rooms[room].code, users: Object.values(rooms[room].users), cursors: rooms[room].cursors });
        socket.to(room).emit('user-joined', { user, users: Object.values(rooms[room].users) });
    });

    socket.on('code-change', (code) => {
        if (currentRoom && rooms[currentRoom]) {
            rooms[currentRoom].code = code;
            socket.to(currentRoom).emit('code-change', code);
        }
    });

    socket.on('cursor-change', (cursor) => {
        if (currentRoom && rooms[currentRoom]) {
            rooms[currentRoom].cursors[socket.id] = { user: username, cursor };
            socket.to(currentRoom).emit('cursor-change', { id: socket.id, user: username, cursor });
        }
    });

    socket.on('disconnect', async () => {
        if (currentRoom && rooms[currentRoom]) {
            delete rooms[currentRoom].users[socket.id];
            delete rooms[currentRoom].cursors[socket.id];
            io.to(currentRoom).emit('user-left', { id: socket.id, users: Object.values(rooms[currentRoom].users) });
            if (Object.keys(rooms[currentRoom].users).length === 0) {
                delete rooms[currentRoom];
            }
        }
        try {
            if (username) {
                await User.deleteOne({ username });
            }
        } catch (err) {
            console.error('Error removing user from DB:', err);
        }
    });
});

httpServer.listen(3000, async (err) => {
    await connectDB();
    if(err){
        console.error("Error while connecting the server:\n", err);
    }
    console.log("The server is running at http://localhost:3000/");
});