const mongoose = require('mongoose');

let isConnected = false;
let memoryStore = null;

const connectDB = async () => {
  if (process.env.NODE_ENV === 'test') {
    isConnected = false;
    return false;
  }
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/posh_puzzle';
  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 3000,
    });
    isConnected = true;
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    isConnected = false;
    console.warn(`[Database] MongoDB not reachable at ${uri}. Activating Enterprise In-Memory Data Store fallback.`);
    return false;
  }
};

const getDBStatus = () => isConnected;

module.exports = {
  connectDB,
  getDBStatus,
};
