const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  type: { type: String, required: true },
  amount: { type: Number, required: true },
  balanceAfter: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now },
  sender: { type: String, required: false },
  recipient: { type: String, required: false },
});

module.exports = mongoose.model('Transaction', transactionSchema);
