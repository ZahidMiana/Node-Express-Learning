const mongoose = require ('mongoose');
mongoose.set("strictQuery", true);

async function connectToMongo(url){
    try {
        return await mongoose.connect(url, {
            serverSelectionTimeoutMS: 5000, // 5 seconds timeout
            socketTimeoutMS: 45000, // 45 seconds socket timeout
        });
    } catch (error) {
        console.error('MongoDB connection error:', error);
        throw error;
    }
}

module.exports = {
    connectToMongo,
}