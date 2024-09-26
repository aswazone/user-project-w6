const mongoose = require('mongoose');

const url = 'mongodb://Localhost:27017/userAuth/'

const connectDB = async () => {
    try {
        const connect = await mongoose.connect(url,{});
        console.log(`MongoDB is connected: ${connect.connection.host}`);
    }catch(err) {
        console.error(err);
        process.exit(1);
    }
};

module.exports = connectDB;