const mongoose = require('mongoose');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/evaluation1';

const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Database connected successfully');
    } catch (error) {
        console.error('Database connection failed:', error);
        process.exit(1);
    }
}

module.exports = connectDB;
