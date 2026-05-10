import io from 'socket.io-client';

const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000';

let socket = null;

export const initSocket = () => {
  if (!socket) {
    socket = io(SOCKET_URL, {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5
    });
  }
  return socket;
};

export const getSocket = () => socket;

export const closeSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const subscribeToStockUpdates = (callback) => {
  if (socket) {
    socket.on('stock-update', callback);
  }
};

export const unsubscribeFromStockUpdates = () => {
  if (socket) {
    socket.off('stock-update');
  }
};

export const subscribeToMarketSimulation = (callback) => {
  if (socket) {
    socket.on('market-simulation', callback);
  }
};

export const subscribeToPortfolioUpdates = (callback) => {
  if (socket) {
    socket.on('portfolio-update', callback);
  }
};

export const subscribeToLeaderboardUpdates = (callback) => {
  if (socket) {
    socket.on('leaderboard-update', callback);
  }
};
