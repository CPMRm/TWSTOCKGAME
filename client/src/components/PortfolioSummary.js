import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPortfolio } from '../features/portfolio/portfolioSlice';
import { initSocket, subscribeToPortfolioUpdates } from '../utils/socket';
import { formatCurrency, formatPercent, getColorClass } from '../utils/format';

const PortfolioSummary = () => {
  const dispatch = useDispatch();
  const { balance, totalAssets, totalProfit, profitPercent } = useSelector(state => state.portfolio);

  useEffect(() => {
    dispatch(fetchPortfolio());
  }, [dispatch]);

  useEffect(() => {
    const socket = initSocket();
    subscribeToPortfolioUpdates((data) => {
      dispatch(fetchPortfolio());
    });
  }, [dispatch]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-gray-600 text-sm font-medium mb-2">現金餘額</h3>
        <p className="text-2xl font-bold">{formatCurrency(balance)}</p>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-gray-600 text-sm font-medium mb-2">總資產</h3>
        <p className="text-2xl font-bold">{formatCurrency(totalAssets)}</p>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-gray-600 text-sm font-medium mb-2">總獲利</h3>
        <p className={`text-2xl font-bold ${getColorClass(totalProfit)}`}>
          {formatCurrency(totalProfit)}
        </p>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-gray-600 text-sm font-medium mb-2">獲利率</h3>
        <p className={`text-2xl font-bold ${getColorClass(profitPercent)}`}>
          {formatPercent(profitPercent)}%
        </p>
      </div>
    </div>
  );
};

export default PortfolioSummary;
