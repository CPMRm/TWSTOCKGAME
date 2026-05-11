import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchLeaderboard, fetchUserStats } from '../features/leaderboard/leaderboardSlice';
import { formatCurrency, formatPercent, getColorClass } from '../utils/format';

const Leaderboard = () => {
  const dispatch = useDispatch();
  const { rankings, userStats } = useSelector(state => state.leaderboard);

  useEffect(() => {
    dispatch(fetchLeaderboard());
    dispatch(fetchUserStats());
  }, [dispatch]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-white mb-6">排行榜</h1>
      
      {userStats && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4">你的排名</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <div className="text-gray-600 text-sm mb-1">排名</div>
              <div className="text-3xl font-bold text-blue-600">#{userStats.rank}</div>
            </div>
            <div>
              <div className="text-gray-600 text-sm mb-1">總資產</div>
              <div className="text-3xl font-bold">{formatCurrency(userStats.totalAssets)}</div>
            </div>
            <div>
              <div className="text-gray-600 text-sm mb-1">總利潤</div>
              <div className={`text-3xl font-bold ${getColorClass(userStats.totalProfit)}`}>
                {formatCurrency(userStats.totalProfit)}
              </div>
            </div>
            <div>
              <div className="text-gray-600 text-sm mb-1">獲利率</div>
              <div className={`text-3xl font-bold ${getColorClass(userStats.profitPercent)}`}>
                {formatPercent(userStats.profitPercent)}%
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 bg-gray-100 border-b">
          <h2 className="text-xl font-bold">全球排行榜</h2>
        </div>
        
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left font-bold">排名</th>
              <th className="px-6 py-3 text-left font-bold">用戶名稱</th>
              <th className="px-6 py-3 text-right font-bold">總資產</th>
              <th className="px-6 py-3 text-right font-bold">總利潤</th>
              <th className="px-6 py-3 text-right font-bold">獲利率</th>
            </tr>
          </thead>
          <tbody>
            {rankings.map((user, index) => (
              <tr key={index} className="border-t hover:bg-gray-50">
                <td className="px-6 py-4 font-bold">
                  {index === 0 && '🥇 '}
                  {index === 1 && '🥈 '}
                  {index === 2 && '🥉 '}
                  #{index + 1}
                </td>
                <td className="px-6 py-4 font-bold">{user.username}</td>
                <td className="px-6 py-4 text-right">{formatCurrency(user.totalAssets)}</td>
                <td className={`px-6 py-4 text-right font-bold ${getColorClass(user.totalProfit)}`}>
                  {formatCurrency(user.totalProfit)}
                </td>
                <td className={`px-6 py-4 text-right font-bold ${getColorClass(user.profitPercent)}`}>
                  {formatPercent(user.profitPercent)}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Leaderboard;
