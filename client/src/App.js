import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getCurrentUser } from './features/auth/authSlice';
import Navigation from './components/Navigation';
import Dashboard from './pages/Dashboard';
import StockMarket from './pages/StockMarket';
import Portfolio from './pages/Portfolio';
import Leaderboard from './pages/Leaderboard';
import Login from './pages/Login';
import Register from './pages/Register';
import PrivateRoute from './components/PrivateRoute';

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, loading } = useSelector(state => state.auth);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && !isAuthenticated) {
      dispatch(getCurrentUser());
    }
  }, [dispatch, isAuthenticated]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-white text-2xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-600">
      {isAuthenticated && <Navigation />}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route element={<PrivateRoute />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/market" element={<StockMarket />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
        </Route>
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
}

export default App;
