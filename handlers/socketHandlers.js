const User = require('../models/User');
const Stock = require('../models/Stock');

const socketHandlers = {
  handleConnection: (socket, io) => {
    socket.on('user-join', (userId) => {
      socket.userId = userId;
      socket.join(`user-${userId}`);
      console.log(`User ${userId} joined`);
    });

    socket.on('subscribe-stock', (stockSymbol) => {
      socket.join(`stock-${stockSymbol}`);
    });

    socket.on('unsubscribe-stock', (stockSymbol) => {
      socket.leave(`stock-${stockSymbol}`);
    });

    socket.on('request-portfolio', async () => {
      try {
        const user = await User.findById(socket.userId);
        if (user) {
          socket.emit('portfolio-update', {
            balance: user.currentBalance,
            portfolio: user.portfolio,
            totalAssets: user.totalAssets
          });
        }
      } catch (err) {
        console.error('Error fetching portfolio:', err);
      }
    });

    socket.on('request-leaderboard', async () => {
      try {
        const users = await User.find()
          .select('username totalAssets totalProfit profitPercent')
          .sort({ totalAssets: -1 })
          .limit(100);
        
        socket.emit('leaderboard-update', users);
      } catch (err) {
        console.error('Error fetching leaderboard:', err);
      }
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.userId);
    });
  }
};

module.exports = socketHandlers;
