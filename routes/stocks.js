const express = require('express');
const router = express.Router();
const Stock = require('../models/Stock');
const auth = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
  try {
    const stocks = await Stock.find({ isInTop50: true }).sort({ symbol: 1 });
    res.json(stocks);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

router.get('/:symbol', auth, async (req, res) => {
  try {
    const stock = await Stock.findOne({ symbol: req.params.symbol });
    if (!stock) {
      return res.status(404).json({ msg: 'Stock not found' });
    }
    res.json(stock);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

router.get('/:symbol/kline', auth, async (req, res) => {
  try {
    const stock = await Stock.findOne({ symbol: req.params.symbol });
    if (!stock) {
      return res.status(404).json({ msg: 'Stock not found' });
    }
    
    const klineData = stock.klineData || [];
    const period = req.query.period || 'daily';
    
    res.json({
      symbol: stock.symbol,
      name: stock.name,
      period,
      data: klineData.slice(-100)
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
