const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const socketIo = require('socket.io');
const schedule = require('schedule');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.NODE_ENV === 'production' ? 'your-production-url' : 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log('MongoDB connection error:', err));

const authRoutes = require('./routes/auth');
const stockRoutes = require('./routes/stocks');
const portfolioRoutes = require('./routes/portfolio');
const tradeRoutes = require('./routes/trades');
const leaderboardRoutes = require('./routes/leaderboard');

app.use('/api/auth', authRoutes);
app.use('/api/stocks', stockRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/trades', tradeRoutes);
app.use('/api/leaderboard', leaderboardRoutes);

const StockDataService = require('./services/stockDataService');
const SimulationService = require('./services/simulationService');
const io_handlers = require('./handlers/socketHandlers');

io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);
  io_handlers.handleConnection(socket, io);
});

const marketHoursJob = schedule.scheduleJob('*/1 * * * *', async () => {
  const now = new Date();
  const day = now.getDay();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const timeInMinutes = hours * 60 + minutes;
  
  const isMarketOpen = day >= 1 && day <= 5 && timeInMinutes >= 540 && timeInMinutes < 810;
  
  if (isMarketOpen) {
    await StockDataService.updateAllStockPrices(io);
  } else {
    await SimulationService.simulateMarketData(io);
  }
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = { app, io };
