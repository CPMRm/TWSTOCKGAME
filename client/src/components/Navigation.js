import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../features/auth/authSlice';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    setIsOpen(false);
    navigate('/login');
  };

  const navItems = [
    { to: '/', label: '儀表板' },
    { to: '/market', label: '股票市場' },
    { to: '/portfolio', label: '投資組合' },
    { to: '/leaderboard', label: '排行榜' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-gray-900 text-white shadow-lg">
      <div className="mx-auto max-w-7xl px-3 sm:px-4">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex-shrink-0 text-lg font-bold text-blue-400 sm:text-xl md:text-2xl">
            TW Stock
          </Link>

          <div className="hidden items-center space-x-4 md:flex lg:space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="text-sm transition hover:text-blue-400 lg:text-base"
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center space-x-2 sm:space-x-3">
            <span className="max-w-[90px] truncate text-xs sm:max-w-[120px] sm:text-sm">
              {user?.username}
            </span>

            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="rounded p-2 text-lg md:hidden"
              aria-label="Toggle menu"
            >
              {isOpen ? '✕' : '☰'}
            </button>

            <button
              type="button"
              onClick={handleLogout}
              className="hidden rounded bg-red-600 px-3 py-2 text-xs transition hover:bg-red-700 md:block md:text-sm"
            >
              登出
            </button>
          </div>
        </div>

        {isOpen && (
          <div className="border-t border-gray-700 pb-3 md:hidden">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setIsOpen(false)}
                className="block px-4 py-3 text-sm transition hover:bg-gray-800 hover:text-blue-400"
              >
                {item.label}
              </Link>
            ))}
            <button
              type="button"
              onClick={handleLogout}
              className="w-full px-4 py-3 text-left text-sm text-red-400 transition hover:bg-gray-800"
            >
              登出
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
