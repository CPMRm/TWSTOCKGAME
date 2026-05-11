import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { sellStock } from '../features/trades/tradeSlice';
import { formatCurrency, formatPrice } from '../utils/format';

const SellModal = ({ holding, onClose, onSuccess }) => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector(state => state.trades);
  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState(holding.currentPrice);

  const totalProceeds = quantity * price;
  const commission = totalProceeds * 0.001425;
  const netProceeds = totalProceeds - commission;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (quantity > holding.quantity) {
      alert('數量不能超過持有數量');
      return;
    }
    
    const result = await dispatch(sellStock({
      stockSymbol: holding.stockSymbol,
      quantity: parseInt(quantity),
      price: parseFloat(price)
    }));
    
    if (!result.payload?.error) {
      onSuccess();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">賣出 {holding.stockSymbol}</h2>
        <p className="text-gray-600 mb-4">可賣數量: {holding.quantity}</p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">數量</label>
            <input
              type="number"
              min="1"
              max={holding.quantity}
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-full border rounded px-3 py-2"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">價格</label>
            <input
              type="number"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full border rounded px-3 py-2"
            />
          </div>
          
          <div className="bg-gray-100 p-3 rounded">
            <div className="flex justify-between mb-2">
              <span>售出金額:</span>
              <span>{formatCurrency(totalProceeds)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>手續費:</span>
              <span>-{formatCurrency(commission)}</span>
            </div>
            <div className="flex justify-between font-bold border-t pt-2">
              <span>淨收入:</span>
              <span>{formatCurrency(netProceeds)}</span>
            </div>
          </div>
          
          {error && <div className="text-red-600 text-sm">{error.msg}</div>}
          
          <div className="flex space-x-2">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-bold py-2 rounded transition"
            >
              {loading ? '處理中...' : '確認賣出'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 rounded transition"
            >
              取消
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SellModal;
