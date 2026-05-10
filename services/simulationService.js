const Stock = require('../models/Stock');
const User = require('../models/User');

const simulationService = {
  simulateMarketData: async (io) => {
    try {
      const stocks = await Stock.find({ isInTop50: true });
      
      for (const stock of stocks) {
        const lastPrice = stock.currentPrice;
        const changePercent = (Math.random() - 0.5) * 0.04;
        const newPrice = lastPrice * (1 + changePercent);
        
        stock.openPrice = stock.closePrice || lastPrice;
        stock.closePrice = newPrice;
        stock.currentPrice = newPrice;
        
        const maxPrice = Math.max(stock.openPrice, stock.currentPrice);
        const minPrice = Math.min(stock.openPrice, stock.currentPrice);
        stock.highPrice = maxPrice * (1 + Math.random() * 0.01);
        stock.lowPrice = minPrice * (1 - Math.random() * 0.01);
        
        stock.volume = Math.floor(Math.random() * 1000000) + 100000;
        stock.priceChange = newPrice - lastPrice;
        stock.priceChangePercent = (stock.priceChange / lastPrice) * 100;
        stock.lastUpdateTime = new Date();
        
        stock.klineData.push({
          timestamp: new Date(),
          open: stock.openPrice,
          high: stock.highPrice,
          low: stock.lowPrice,
          close: stock.currentPrice,
          volume: stock.volume
        });
        
        if (stock.klineData.length > 500) {
          stock.klineData = stock.klineData.slice(-500);
        }
        
        await stock.save();
      }
      
      const users = await User.find();
      for (const user of users) {
        let totalStockValue = 0;
        
        for (const holding of user.portfolio) {
          const stock = stocks.find(s => s.symbol === holding.stockSymbol);
          if (stock) {
            holding.currentPrice = stock.currentPrice;
            holding.currentValue = holding.quantity * stock.currentPrice;
            holding.gainLoss = holding.currentValue - holding.totalCost;
            holding.gainLossPercent = (holding.gainLoss / holding.totalCost) * 100;
            totalStockValue += holding.currentValue;
          }
        }
        
        user.totalAssets = user.currentBalance + totalStockValue;
        user.totalProfit = user.totalAssets - user.initialCapital;
        user.profitPercent = (user.totalProfit / user.initialCapital) * 100;
        
        await user.save();
      }
      
      if (io) {
        io.emit('market-simulation', { stocks, timestamp: new Date() });
      }
    } catch (err) {
      console.error('Error simulating market data:', err);
    }
  }
};

module.exports = simulationService;
