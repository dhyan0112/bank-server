require('dotenv').config();

module.exports = {
  mongoURI: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/bankingApp',
  JWT_SECRET: process.env.JWT_SECRET || 'your-secret-key',
};

