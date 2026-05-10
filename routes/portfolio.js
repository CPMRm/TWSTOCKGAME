const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Stock = require('../models/Stock');
const auth = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    
    const updatedPortfolio = await Promise.all(
      user.portfolio.map(async (holding) => {
        const stock = await Stock.findOne({ symbol: holding.stockSymbol });
        if (stock) {
          holding.currentPrice = stock.currentPrice;
          holding.currentValue = holding.quantity * stock.currentPrice;
          holding.gainLoss = holding.currentValue - holding.totalCost;
          holding.gainLossPercent = (holding.gainLoss / holding.totalCost) * 100;
        }
        return holding;
      })
    );
    
    user.portfolio = updatedPortfolio;
    
    res.json({
      balance: user.currentBalance,
      portfolio: user.portfolio,
      totalAssets: user.totalAssets,
      totalProfit: user.totalProfit,
      profitPercent: user.profitPercent
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

router.get('/stats', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    
    let totalStockValue = 0;
    user.portfolio.forEach(holding => {
      totalStockValue += holding.currentValue || 0;
    });
    
    const totalAssets = user.currentBalance + totalStockValue;
    const totalProfit = totalAssets - user.initialCapital;
    const profitPercent = (totalProfit / user.initialCapital) * 100;
    
    res.json({
      currentBalance: user.currentBalance,
      stockValue: totalStockValue,
      totalAssets,
      totalProfit,
      profitPercent
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
