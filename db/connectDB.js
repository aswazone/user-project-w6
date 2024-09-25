const mongoose = require('mongoose');

const url = 'mongodb://Localhost:27017'

const connectDB = () => {
    try {
        const connect = mongoose.connect(url,{
            useUnifiedTopology: true,
            useNewUrlParser: true,
            useCreateIndex: true
        });
        console.log(`MongoDB is connected: ${connect.connection.host}`);
    }catch(err) {
        console.error(err);
        process.exit(1);
    }
};

module.exports = connectDB;