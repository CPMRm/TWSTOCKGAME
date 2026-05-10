import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/auth/authSlice';
import stockReducer from './features/stocks/stockSlice';
import portfolioReducer from './features/portfolio/portfolioSlice';
import tradeReducer from './features/trades/tradeSlice';
import leaderboardReducer from './features/leaderboard/leaderboardSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    stocks: stockReducer,
    portfolio: portfolioReducer,
    trades: tradeReducer,
    leaderboard: leaderboardReducer
  }
});

export default store;
