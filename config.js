require('dotenv').config();

module.exports = {
  mongoURI: process.env.MONGO_URI || 'mongodb://localhost:27017/bankingApp',
  JWT_SECRET: process.env.JWT_SECRET || 'your-secret-key',
};

