const Stock = require('../models/Stock');
const axios = require('axios');

const TOP_50_STOCKS = [
  { symbol: '2330', name: 'TSMC' },
  { symbol: '2454', name: 'MediaTek' },
  { symbol: '2317', name: 'Quanta Services' },
  { symbol: '2303', name: 'UMC' },
  { symbol: '2412', name: 'Chunghwa Telecom' },
  { symbol: '3008', name: 'Largan Precision' },
  { symbol: '2308', name: 'Delta Electronics' },
  { symbol: '2357', name: 'Acer' },
  { symbol: '2382', name: 'Quanta Services' },
  { symbol: '2207', name: 'Asustek' },
  { symbol: '1216', name: 'Acer' },
  { symbol: '2409', name: 'MStar' },
  { symbol: '3034', name: 'Sunplus' },
  { symbol: '1101', name: 'Taiwan Cement' },
  { symbol: '1102', name: 'Asia Cement' },
  { symbol: '1326', name: 'TSEC' },
  { symbol: '1590', name: 'Taiwan Fertilizer' },
  { symbol: '1605', name: 'FSIL' },
  { symbol: '1723', name: 'Formosa Plastics' },
  { symbol: '1907', name: 'Taiwan Glass' },
  { symbol: '2002', name: 'Chihon' },
  { symbol: '2006', name: 'Transcend' },
  { symbol: '2012', name: 'Pou Chen' },
  { symbol: '2015', name: 'Apacer' },
  { symbol: '2018', name: 'Airborne' },
  { symbol: '2020', name: 'Asus' },
  { symbol: '2023', name: 'Asustek' },
  { symbol: '2024', name: 'Pegatron' },
  { symbol: '2027', name: 'Acer Inc' },
  { symbol: '2049', name: 'Innolux' },
  { symbol: '2058', name: 'Leadtrend' },
  { symbol: '2069', name: 'Aopen' },
  { symbol: '2082', name: 'Ennoconn' },
  { symbol: '2083', name: 'Garmin' },
  { symbol: '2101', name: 'Nan Ya' },
  { symbol: '2102', name: 'Asia Cement' },
  { symbol: '2104', name: 'Micron' },
  { symbol: '2105', name: 'Taiwan Chlorine' },
  { symbol: '2106', name: 'Liuyang Chemical' },
  { symbol: '2204', name: 'China Airlines' },
  { symbol: '2227', name: 'Acer' },
  { symbol: '2228', name: 'Malata' },
  { symbol: '2231', name: 'Netac' },
  { symbol: '2239', name: 'Apacer' },
  { symbol: '2240', name: 'Aura' },
  { symbol: '2247', name: 'Shenzhen Hongbao' },
  { symbol: '2249', name: 'Seagate' },
  { symbol: '2268', name: 'Acer Inc' },
  { symbol: '2301', name: 'ASMedia' },
  { symbol: '2302', name: 'Realtek' }
];

const stockDataService = {
  initializeStocks: async () => {
    try {
      for (const stock of TOP_50_STOCKS) {
        const existingStock = await Stock.findOne({ symbol: stock.symbol });
        if (!existingStock) {
          const newStock = new Stock({
            symbol: stock.symbol,
            name: stock.name,
            currentPrice: 100,
            openPrice: 100,
            highPrice: 100,
            lowPrice: 100,
            closePrice: 100,
            isInTop50: true,
            klineData: []
          });
          await newStock.save();
        }
      }
      console.log('Stocks initialized');
    } catch (err) {
      console.error('Error initializing stocks:', err);
    }
  },

  updateAllStockPrices: async (io) => {
    try {
      const stocks = await Stock.find({ isInTop50: true });
      
      for (const stock of stocks) {
        try {
          const previousClose = stock.closePrice || stock.currentPrice;
          const changePercent = (Math.random() - 0.5) * 0.02;
          const newPrice = previousClose * (1 + changePercent);
          
          stock.currentPrice = newPrice;
          stock.openPrice = previousClose;
          stock.closePrice = newPrice;
          stock.highPrice = Math.max(previousClose, newPrice) * 1.001;
          stock.lowPrice = Math.min(previousClose, newPrice) * 0.999;
          stock.volume = Math.floor(Math.random() * 5000000) + 500000;
          stock.priceChange = newPrice - previousClose;
          stock.priceChangePercent = (stock.priceChange / previousClose) * 100;
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
        } catch (err) {
          console.error(`Error updating stock ${stock.symbol}:`, err.message);
        }
      }

      if (io) {
        io.emit('stock-update', { stocks, timestamp: new Date() });
      }
    } catch (err) {
      console.error('Error updating stock prices:', err);
    }
  },

  getStockPrice: async (symbol) => {
    try {
      const stock = await Stock.findOne({ symbol });
      return stock ? stock.currentPrice : null;
    } catch (err) {
      console.error('Error getting stock price:', err);
      return null;
    }
  }
};

module.exports = stockDataService;
