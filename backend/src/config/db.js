const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      process.env.MONGODB_URI || 'mongodb://localhost:27017/medibridge',
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    // Don't exit in demo mode — app can work with in-memory demo data
    if (process.env.NODE_ENV !== 'demo') {
      process.exit(1);
    }
  }
};

module.exports = connectDB;
