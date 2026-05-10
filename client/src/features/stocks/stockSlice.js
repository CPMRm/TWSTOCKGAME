import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const fetchStocks = createAsyncThunk(
  'stocks/fetchStocks',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE}/stocks`, {
        headers: { 'x-auth-token': token }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const fetchStockDetail = createAsyncThunk(
  'stocks/fetchStockDetail',
  async (symbol, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE}/stocks/${symbol}`, {
        headers: { 'x-auth-token': token }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const fetchKlineData = createAsyncThunk(
  'stocks/fetchKlineData',
  async ({ symbol, period }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE}/stocks/${symbol}/kline?period=${period}`, {
        headers: { 'x-auth-token': token }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

const stockSlice = createSlice({
  name: 'stocks',
  initialState: {
    stocks: [],
    selectedStock: null,
    klineData: [],
    loading: false,
    error: null
  },
  reducers: {
    clearSelectedStock: (state) => {
      state.selectedStock = null;
      state.klineData = [];
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStocks.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchStocks.fulfilled, (state, action) => {
        state.loading = false;
        state.stocks = action.payload;
      })
      .addCase(fetchStocks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchStockDetail.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchStockDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedStock = action.payload;
      })
      .addCase(fetchStockDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchKlineData.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchKlineData.fulfilled, (state, action) => {
        state.loading = false;
        state.klineData = action.payload.data;
      })
      .addCase(fetchKlineData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearSelectedStock } = stockSlice.actions;
export default stockSlice.reducer;
