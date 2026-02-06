const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      // Connection options for mongoose 7+
      serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    console.log('💡 Please ensure MongoDB is running locally on 127.0.0.1:27017');
    console.log('💡 Or update MONGO_URI in .env for Atlas connection');
    return false;
  }
};

module.exports = connectDB;