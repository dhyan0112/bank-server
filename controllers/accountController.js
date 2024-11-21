const User = require('../models/User');
const Transaction = require('../models/Transaction');

// Get Dashboard (Balance and Transaction History)
exports.getDashboard = async (req, res) => {
  try {
    const user = req.user;
    const transactions = await Transaction.find({
      $or: [{ sender: user.username }, { recipient: user.username }],
    });

    res.json({
      balance: user.balance,
      transactions,
    });
  } catch (error) {
    res.status(500).json({ error: 'Unable to fetch dashboard data' });
  }
};

// Deposit Money
exports.deposit = async (req, res) => {
  const { amount } = req.body;
  const user = req.user;

  if (amount <= 0) {
    return res.status(400).json({ error: 'Deposit amount must be greater than zero' });
  }

  try {
    user.balance += amount;
    const transaction = new Transaction({
      type: 'Deposit',
      amount,
      balanceAfter: user.balance,
    });

    await user.save();
    await transaction.save();

    res.json({ message: 'Deposit successful', balance: user.balance });
  } catch (error) {
    res.status(500).json({ error: 'Deposit failed' });
  }
};

// Transfer Money
exports.transfer = async (req, res) => {
  const { recipientUsername, amount } = req.body;
  const sender = req.user;

  if (amount <= 0) {
    return res.status(400).json({ error: 'Transfer amount must be greater than zero' });
  }

  try {
    const recipient = await User.findOne({ username: recipientUsername });
    if (!recipient) {
      return res.status(400).json({ error: 'Recipient not found' });
    }

    if (sender.balance < amount) {
      return res.status(400).json({ error: 'Insufficient balance' });
    }

    sender.balance -= amount;
    recipient.balance += amount;

    const transactionSender = new Transaction({
      type: 'Transfer',
      amount,
      balanceAfter: sender.balance,
      sender: sender.username,
      recipient: recipient.username,
    });

    const transactionRecipient = new Transaction({
      type: 'Transfer',
      amount,
      balanceAfter: recipient.balance,
      sender: sender.username,
      recipient: recipient.username,
    });

    await sender.save();
    await recipient.save();
    await transactionSender.save();
    await transactionRecipient.save();

    res.json({ message: 'Transfer successful' });
  } catch (error) {
    res.status(500).json({ error: 'Transfer failed' });
  }
};
