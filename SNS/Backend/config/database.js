const mongoose = require('mongoose');
require('dotenv').config();

const DB_URL = process.env.DB_URL || 'mongodb://localhost:27017/sns';
const MAX_RETRIES = 5;
const RETRY_DELAY = 5000;

let retries = 0;

async function connectDB() {
    async function connectWithRetry() {
        try {
            await mongoose.connect(DB_URL, {
                useNewUrlParser: true,
                useUnifiedTopology: true
            });
            console.log("✅ Successfully connected to the database");
        } catch (error) {
            console.error("❌ Error while connecting to the database:", error.message);
            retries++;
            if (retries <= MAX_RETRIES) {
                console.log(`🔁 Retrying to connect (${retries}/${MAX_RETRIES}) in ${RETRY_DELAY / 1000}s...`);
                setTimeout(connectWithRetry, RETRY_DELAY);
            }
            else {
                console.error("❌ Maximum retry attempts reached");
                process.exit(1);
            }
        }
    }

    mongoose.connection.on("connected", () => {
        console.log("✅ MongoDB Connected");
    });

    mongoose.connection.on("disconnected", () => {
        console.warn("❌ MongoDB Disconnected");
    });

    mongoose.connection.on("reconnected", () => {
        console.log("🔁 MongoDB Reconnected");
    });

    mongoose.connection.on("error", (err) => {
        console.error("❌ MongoDB Connection Error:", err.message);
    });

    await connectWithRetry();
}

module.exports = connectDB;