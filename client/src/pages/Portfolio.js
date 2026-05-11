import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPortfolio } from '../features/portfolio/portfolioSlice';
import { fetchTradeHistory } from '../features/trades/tradeSlice';
import PortfolioSummary from '../components/PortfolioSummary';
import SellModal from '../components/SellModal';
import { formatCurrency, formatPrice, getColorClass } from '../utils/format';
import { useState } from 'react';

const Portfolio = () => {
  const dispatch = useDispatch();
  const { portfolio, balance } = useSelector(state => state.portfolio);
  const { tradeHistory } = useSelector(state => state.trades);
  const [selectedHolding, setSelectedHolding] = useState(null);
  const [showSellModal, setShowSellModal] = useState(false);

  useEffect(() => {
    dispatch(fetchPortfolio());
    dispatch(fetchTradeHistory());
  }, [dispatch]);

  const handleSellClick = (holding) => {
    setSelectedHolding(holding);
    setShowSellModal(true);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-white mb-6">我的投資組合</h1>
      
      <PortfolioSummary />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 bg-gray-100 border-b">
              <h2 className="text-xl font-bold">持股清單</h2>
            </div>
            
            {portfolio.length === 0 ? (
              <div className="px-6 py-8 text-center text-gray-600">
                尚未購買任何股票
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left font-bold">股票代碼</th>
                    <th className="px-6 py-3 text-right font-bold">持有數量</th>
                    <th className="px-6 py-3 text-right font-bold">現價</th>
                    <th className="px-6 py-3 text-right font-bold">損益</th>
                    <th className="px-6 py-3 text-center font-bold">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {portfolio.map((holding) => (
                    <tr key={holding.stockSymbol} className="border-t hover:bg-gray-50">
                      <td className="px-6 py-4 font-bold">{holding.stockSymbol}</td>
                      <td className="px-6 py-4 text-right">{holding.quantity}</td>
                      <td className="px-6 py-4 text-right">{formatPrice(holding.currentPrice)}</td>
                      <td className={`px-6 py-4 text-right font-bold ${getColorClass(holding.gainLoss)}`}>
                        {formatCurrency(holding.gainLoss)} ({formatPrice(holding.gainLossPercent)}%)
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => handleSellClick(holding)}
                          className="bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded text-sm transition"
                        >
                          賣出
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
        
        <div>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 bg-gray-100 border-b">
              <h2 className="text-xl font-bold">近期交易</h2>
            </div>
            
            {tradeHistory.length === 0 ? (
              <div className="px-6 py-8 text-center text-gray-600">
                尚無交易紀錄
              </div>
            ) : (
              <div className="divide-y max-h-96 overflow-y-auto">
                {tradeHistory.slice(0, 10).map((trade, index) => (
                  <div key={index} className="px-6 py-3">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-bold">{trade.stockSymbol}</div>
                        <div className="text-sm text-gray-600">
                          {trade.type === 'buy' ? '買入' : '賣出'} {trade.quantity}股
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={trade.type === 'buy' ? 'text-red-600' : 'text-green-600'}>
                          {formatCurrency(trade.amount)}
                        </div>
                        <div className="text-xs text-gray-600">
                          {new Date(trade.createdAt).toLocaleDateString('zh-TW')}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {showSellModal && selectedHolding && (
        <SellModal
          holding={selectedHolding}
          onClose={() => setShowSellModal(false)}
          onSuccess={() => dispatch(fetchPortfolio())}
        />
      )}
    </div>
  );
};

export default Portfolio;
