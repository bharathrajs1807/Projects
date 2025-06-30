const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const connectDB = require('./config/database');
const AuthRouter = require('./routes/auth.route');
const ProductRouter = require('./routes/product.route');
const authMiddleware = require('./middlewares/auth.middleware');
const errorHandler = require('./middlewares/error.middleware');

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'Too many requests from this IP, please try again later.'
});

const PORT = process.env.PORT || 3000;

const server = express();

server.use(helmet());
server.use(cors());
server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.use(limiter);
server.use(cookieParser());

server.use('/api/auth', AuthRouter);
server.use('/api/products', authMiddleware, ProductRouter);

server.use('/', (req, res) => {
    res.status(200).json({ message: 'Healthy' });
});

server.use(errorHandler);

server.listen(PORT, async (err) => {
    if (err) {
        console.error('Error starting server:', err);
    } else {
        console.log(`Server is running on port ${PORT}`);
        await connectDB();
    }
});
