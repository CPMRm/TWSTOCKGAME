import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const fetchPortfolio = createAsyncThunk(
  'portfolio/fetchPortfolio',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE}/portfolio`, {
        headers: { 'x-auth-token': token }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const fetchPortfolioStats = createAsyncThunk(
  'portfolio/fetchPortfolioStats',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE}/portfolio/stats`, {
        headers: { 'x-auth-token': token }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

const portfolioSlice = createSlice({
  name: 'portfolio',
  initialState: {
    balance: 0,
    portfolio: [],
    totalAssets: 0,
    totalProfit: 0,
    profitPercent: 0,
    loading: false,
    error: null
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPortfolio.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPortfolio.fulfilled, (state, action) => {
        state.loading = false;
        state.balance = action.payload.balance;
        state.portfolio = action.payload.portfolio;
        state.totalAssets = action.payload.totalAssets;
        state.totalProfit = action.payload.totalProfit;
        state.profitPercent = action.payload.profitPercent;
      })
      .addCase(fetchPortfolio.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchPortfolioStats.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPortfolioStats.fulfilled, (state, action) => {
        state.loading = false;
        state.balance = action.payload.currentBalance;
        state.totalAssets = action.payload.totalAssets;
        state.totalProfit = action.payload.totalProfit;
        state.profitPercent = action.payload.profitPercent;
      })
      .addCase(fetchPortfolioStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export default portfolioSlice.reducer;
