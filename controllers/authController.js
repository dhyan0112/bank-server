const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { JWT_SECRET } = require('../config');

// User Registration
exports.register = async (req, res) => {
  const { username, pin, initialDeposit } = req.body;

  try {
    const hashedPin = await bcrypt.hash(pin, 10);
    const user = new User({
      username,
      pin: hashedPin,
      balance: initialDeposit || 0,
    });
    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(400).json({ error: 'Username already exists' });
  }
};

// User Login
exports.login = async (req, res) => {
  const { username, pin } = req.body;

  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(400).json({ error: 'Invalid username or PIN' });
    }

    // Check if account is locked
    if (user.lockUntil && user.lockUntil > Date.now()) {
      return res.status(403).json({ error: 'Account is locked. Please try again later.' });
    }

    // Verify PIN
    const isMatch = await bcrypt.compare(pin, user.pin);
    if (!isMatch) {
      user.failedLoginAttempts += 1;

      if (user.failedLoginAttempts >= 3) {
        user.lockUntil = Date.now() + 24 * 60 * 60 * 1000; // lock for 24 hours
      }

      await user.save();
      return res.status(400).json({ error: 'Invalid username or PIN' });
    }

    // Reset failed attempts on successful login
    user.failedLoginAttempts = 0;
    user.lockUntil = null;
    await user.save();

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};
