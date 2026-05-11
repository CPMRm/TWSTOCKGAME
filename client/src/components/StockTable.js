import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStocks, fetchStockDetail } from '../features/stocks/stockSlice';
import { initSocket, subscribeToStockUpdates } from '../utils/socket';
import { formatPrice, getColorClass } from '../utils/format';
import BuyModal from './BuyModal';

const StockTable = () => {
  const dispatch = useDispatch();
  const { stocks, loading } = useSelector(state => state.stocks);
  const [selectedStock, setSelectedStock] = useState(null);
  const [showBuyModal, setShowBuyModal] = useState(false);

  useEffect(() => {
    dispatch(fetchStocks());
  }, [dispatch]);

  useEffect(() => {
    const socket = initSocket();
    subscribeToStockUpdates(() => {
      dispatch(fetchStocks());
    });
  }, [dispatch]);

  const handleBuyClick = (stock) => {
    setSelectedStock(stock);
    setShowBuyModal(true);
  };

  if (loading) return <div className="text-white text-center py-8">加載中...</div>;

  return (
    <>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-6 py-3 text-left font-bold">股票代碼</th>
              <th className="px-6 py-3 text-right font-bold">現價</th>
              <th className="px-6 py-3 text-right font-bold">漲跌</th>
              <th className="px-6 py-3 text-right font-bold">漲幅</th>
              <th className="px-6 py-3 text-right font-bold">成交量</th>
              <th className="px-6 py-3 text-center font-bold">操作</th>
            </tr>
          </thead>
          <tbody>
            {stocks.map((stock) => (
              <tr key={stock.symbol} className="border-t hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div>
                    <div className="font-bold">{stock.symbol}</div>
                    <div className="text-gray-600 text-sm">{stock.name}</div>
                  </div>
                </td>
                <td className="px-6 py-4 text-right font-bold">
                  ${formatPrice(stock.currentPrice)}
                </td>
                <td className={`px-6 py-4 text-right font-bold ${getColorClass(stock.priceChange)}`}>
                  {stock.priceChange > 0 ? '+' : ''}{formatPrice(stock.priceChange)}
                </td>
                <td className={`px-6 py-4 text-right font-bold ${getColorClass(stock.priceChangePercent)}`}>
                  {stock.priceChangePercent > 0 ? '+' : ''}{formatPrice(stock.priceChangePercent)}%
                </td>
                <td className="px-6 py-4 text-right text-gray-600">
                  {(stock.volume / 1000000).toFixed(2)}M
                </td>
                <td className="px-6 py-4 text-center">
                  <button
                    onClick={() => handleBuyClick(stock)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded text-sm transition"
                  >
                    買入
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {showBuyModal && selectedStock && (
        <BuyModal
          stock={selectedStock}
          onClose={() => setShowBuyModal(false)}
          onSuccess={() => dispatch(fetchStocks())}
        />
      )}
    </>
  );
};

export default StockTable;
