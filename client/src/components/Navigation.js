import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../features/auth/authSlice';

const Navigation = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector(state => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <nav className="bg-gray-900 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link to="/" className="text-2xl font-bold text-blue-400">
              TW Stock Game
            </Link>
            <div className="space-x-4">
              <Link to="/" className="hover:text-blue-400 transition">儀表板</Link>
              <Link to="/market" className="hover:text-blue-400 transition">股票市場</Link>
              <Link to="/portfolio" className="hover:text-blue-400 transition">投資組合</Link>
              <Link to="/leaderboard" className="hover:text-blue-400 transition">排行榜</Link>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm">{user?.username}</span>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded transition"
            >
              登出
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
