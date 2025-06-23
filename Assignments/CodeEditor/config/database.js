const mongoose = require('mongoose');
require('dotenv').config();

const DB_URL = process.env.DB_URL;

const connectDB = async function(){
    try {
        await mongoose.connect(DB_URL);
        console.log("The database is connected.");
    } catch (error) {
        console.log("Error connecting the database:\n", error)
    }
};

module.exports = connectDB;