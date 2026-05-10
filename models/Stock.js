const mongoose = require('mongoose');

const stockSchema = new mongoose.Schema({
  symbol: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  name: {
    type: String,
    required: true
  },
  currentPrice: {
    type: Number,
    required: true
  },
  openPrice: {
    type: Number
  },
  highPrice: {
    type: Number
  },
  lowPrice: {
    type: Number
  },
  closePrice: {
    type: Number
  },
  volume: {
    type: Number
  },
  priceChange: {
    type: Number
  },
  priceChangePercent: {
    type: Number
  },
  lastUpdateTime: {
    type: Date,
    default: Date.now
  },
  klineData: [
    {
      timestamp: Date,
      open: Number,
      high: Number,
      low: Number,
      close: Number,
      volume: Number
    }
  ],
  isInTop50: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model('Stock', stockSchema);
