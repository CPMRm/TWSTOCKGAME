import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const fetchLeaderboard = createAsyncThunk(
  'leaderboard/fetchLeaderboard',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE}/leaderboard`, {
        headers: { 'x-auth-token': token }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const fetchUserStats = createAsyncThunk(
  'leaderboard/fetchUserStats',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE}/leaderboard/user/stats`, {
        headers: { 'x-auth-token': token }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

const leaderboardSlice = createSlice({
  name: 'leaderboard',
  initialState: {
    rankings: [],
    userStats: null,
    loading: false,
    error: null
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLeaderboard.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchLeaderboard.fulfilled, (state, action) => {
        state.loading = false;
        state.rankings = action.payload;
      })
      .addCase(fetchLeaderboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchUserStats.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserStats.fulfilled, (state, action) => {
        state.loading = false;
        state.userStats = action.payload;
      })
      .addCase(fetchUserStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export default leaderboardSlice.reducer;
