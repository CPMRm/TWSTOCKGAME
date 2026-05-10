const mongoose = require('mongoose');

const tradeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  stockSymbol: {
    type: String,
    required: true
  },
  tradeType: {
    type: String,
    enum: ['BUY', 'SELL'],
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  totalAmount: {
    type: Number,
    required: true
  },
  commission: {
    type: Number,
    default: 0
  },
  tradeDate: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['COMPLETED', 'PENDING', 'CANCELLED'],
    default: 'COMPLETED'
  }
});

module.exports = mongoose.model('Trade', tradeSchema);
