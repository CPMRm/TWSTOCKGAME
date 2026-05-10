export const formatCurrency = (value) => {
  return new Intl.NumberFormat('zh-TW', {
    style: 'currency',
    currency: 'TWD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
};

export const formatPrice = (price) => {
  return price.toFixed(2);
};

export const formatPercent = (percent) => {
  return percent.toFixed(2);
};

export const getColorClass = (value) => {
  if (value > 0) return 'stock-green';
  if (value < 0) return 'stock-red';
  return 'text-gray-600';
};

export const isMarketOpen = () => {
  const now = new Date();
  const day = now.getDay();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const timeInMinutes = hours * 60 + minutes;
  
  return day >= 1 && day <= 5 && timeInMinutes >= 540 && timeInMinutes < 810;
};
