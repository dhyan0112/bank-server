const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const { getDashboard, deposit, transfer } = require('../controllers/accountController');

const router = express.Router();

router.get('/dashboard', authMiddleware, getDashboard);
router.post('/deposit', authMiddleware, deposit);
router.post('/transfer', authMiddleware, transfer);

module.exports = router;

