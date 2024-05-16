const mongoose = require('mongoose');
const mongoURI = "mongodb://0.0.0.0:27017/cloudbook";

const connectToMongoose = async () => {
    try {
        mongoose.connect(mongoURI);
        console.log("Connected to Mongoose");
    } catch (error) {
        console.error("Error connecting to Mongoose:", error);
    }
};

module.exports = connectToMongoose;
