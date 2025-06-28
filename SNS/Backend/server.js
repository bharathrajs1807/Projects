const http = require('http');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const connectDB = require('./config/database');
const AuthRouter = require('./routes/auth.route');
const UserRouter = require('./routes/user.route');
const PostRouter = require('./routes/post.route');
const authMiddleware = require('./middlewares/auth.middleware');
const errorMiddleware = require('./middlewares/error.middleware');

const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));
app.use(rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100
}));
app.use(cookieParser());

app.get("/", (req, res) => {
    res.status(200).json({ message: "Healthy" });
});

app.get("/test", async (req, res) => {
    try {
        const userCount = await mongoose.model('User').countDocuments();
        const postCount = await mongoose.model('Post').countDocuments();
        res.status(200).json({ 
            message: "Database connection working",
            userCount,
            postCount
        });
    } catch (error) {
        console.error('Test endpoint error:', error);
        res.status(500).json({ message: "Database connection failed", error: error.message });
    }
});

app.use("/auth", AuthRouter);
app.use("/user", authMiddleware, UserRouter);
app.use("/post", authMiddleware, PostRouter);

app.use((req, res, next) => {
    res.status(404).json({ message: "Route not found" });
});

app.use(errorMiddleware);

const startServer = async () => {
    try {
        console.log('Starting server...');
        console.log('Connecting to database...');
        await connectDB();
        console.log('Database connected successfully');
        
        server.listen(PORT, () => {
            console.log(`✅ The server is running at http://localhost:${PORT}`);
            console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
            console.log(`🔗 CORS origin: http://localhost:5173`);
        });
    } catch (err) {
        console.error("❌ Failed to start server:", err);
        process.exit(1);
    }
};

startServer();

let isShuttingDown = false;
const gracefulShutdown = async () => {
    if (isShuttingDown) return;
    isShuttingDown = true;
    console.log("Gracefully shutting down...");
    try {
        await mongoose.disconnect();
        server.close(() => {
            console.log("Server closed");
            process.exit(0);
        });
    } catch (err) {
        console.error("Error during shutdown:", err);
        process.exit(1);
    }
};

process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);

process.on('unhandledRejection', err => {
    console.error("Unhandled Rejection:", err);
    process.exit(1);
});

