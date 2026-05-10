const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Stock = require('../models/Stock');
const Trade = require('../models/Trade');
const auth = require('../middleware/auth');
const { validationResult, body } = require('express-validator');

const COMMISSION_RATE = 0.001425;

router.post('/buy',
  auth,
  body('stockSymbol').trim().notEmpty(),
  body('quantity').isInt({ min: 1 }),
  body('price').isFloat({ min: 0.01 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { stockSymbol, quantity, price } = req.body;
      const user = await User.findById(req.userId);
      const stock = await Stock.findOne({ symbol: stockSymbol });
      
      if (!stock) {
        return res.status(404).json({ msg: 'Stock not found' });
      }

      const totalCost = quantity * price;
      const commission = totalCost * COMMISSION_RATE;
      const totalAmount = totalCost + commission;

      if (user.currentBalance < totalAmount) {
        return res.status(400).json({ msg: 'Insufficient balance' });
      }

      user.currentBalance -= totalAmount;

      let holding = user.portfolio.find(h => h.stockSymbol === stockSymbol);
      if (holding) {
        const newQuantity = holding.quantity + quantity;
        const newTotalCost = holding.totalCost + totalCost;
        holding.quantity = newQuantity;
        holding.totalCost = newTotalCost;
        holding.averagePrice = newTotalCost / newQuantity;
      } else {
        user.portfolio.push({
          stockSymbol,
          quantity,
          averagePrice: price,
          currentPrice: price,
          totalCost,
          currentValue: totalCost,
          gainLoss: 0,
          gainLossPercent: 0
        });
      }

      await user.save();

      const trade = new Trade({
        userId: req.userId,
        stockSymbol,
        tradeType: 'BUY',
        quantity,
        price,
        totalAmount,
        commission
      });
      await trade.save();

      res.json({
        msg: 'Buy order completed',
        balance: user.currentBalance,
        portfolio: user.portfolio,
        trade
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

router.post('/sell',
  auth,
  body('stockSymbol').trim().notEmpty(),
  body('quantity').isInt({ min: 1 }),
  body('price').isFloat({ min: 0.01 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { stockSymbol, quantity, price } = req.body;
      const user = await User.findById(req.userId);
      
      const holding = user.portfolio.find(h => h.stockSymbol === stockSymbol);
      if (!holding || holding.quantity < quantity) {
        return res.status(400).json({ msg: 'Insufficient stock quantity' });
      }

      const totalProceeds = quantity * price;
      const commission = totalProceeds * COMMISSION_RATE;
      const netProceeds = totalProceeds - commission;

      user.currentBalance += netProceeds;

      holding.quantity -= quantity;
      if (holding.quantity === 0) {
        user.portfolio = user.portfolio.filter(h => h.stockSymbol !== stockSymbol);
      } else {
        holding.currentValue = holding.quantity * holding.averagePrice;
      }

      await user.save();

      const trade = new Trade({
        userId: req.userId,
        stockSymbol,
        tradeType: 'SELL',
        quantity,
        price,
        totalAmount: totalProceeds,
        commission
      });
      await trade.save();

      res.json({
        msg: 'Sell order completed',
        balance: user.currentBalance,
        portfolio: user.portfolio,
        trade
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

router.get('/history', auth, async (req, res) => {
  try {
    const trades = await Trade.find({ userId: req.userId }).sort({ tradeDate: -1 }).limit(50);
    res.json(trades);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
