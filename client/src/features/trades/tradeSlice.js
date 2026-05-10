import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const buyStock = createAsyncThunk(
  'trades/buyStock',
  async ({ stockSymbol, quantity, price }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${API_BASE}/trades/buy`, 
        { stockSymbol, quantity, price },
        { headers: { 'x-auth-token': token } }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const sellStock = createAsyncThunk(
  'trades/sellStock',
  async ({ stockSymbol, quantity, price }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${API_BASE}/trades/sell`, 
        { stockSymbol, quantity, price },
        { headers: { 'x-auth-token': token } }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const fetchTradeHistory = createAsyncThunk(
  'trades/fetchTradeHistory',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE}/trades/history`, {
        headers: { 'x-auth-token': token }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

const tradeSlice = createSlice({
  name: 'trades',
  initialState: {
    tradeHistory: [],
    lastTrade: null,
    loading: false,
    error: null,
    success: false
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = false;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(buyStock.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(buyStock.fulfilled, (state, action) => {
        state.loading = false;
        state.lastTrade = action.payload.trade;
        state.success = true;
      })
      .addCase(buyStock.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(sellStock.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sellStock.fulfilled, (state, action) => {
        state.loading = false;
        state.lastTrade = action.payload.trade;
        state.success = true;
      })
      .addCase(sellStock.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchTradeHistory.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTradeHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.tradeHistory = action.payload;
      })
      .addCase(fetchTradeHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearError, clearSuccess } = tradeSlice.actions;
export default tradeSlice.reducer;
