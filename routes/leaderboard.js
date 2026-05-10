const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Stock = require('../models/Stock');
const auth = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
  try {
    const users = await User.find()
      .select('username totalAssets totalProfit profitPercent rank createdAt')
      .sort({ totalAssets: -1 })
      .limit(100);

    users.forEach((user, index) => {
      user.rank = index + 1;
    });

    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

router.get('/user/stats', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    const allUsers = await User.find()
      .select('totalAssets')
      .sort({ totalAssets: -1 });

    const rank = allUsers.findIndex(u => u._id.toString() === req.userId) + 1;

    res.json({
      username: user.username,
      rank,
      totalAssets: user.totalAssets,
      totalProfit: user.totalProfit,
      profitPercent: user.profitPercent,
      initialCapital: user.initialCapital
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
