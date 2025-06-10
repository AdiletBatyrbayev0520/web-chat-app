import React from 'react';

const ConnectionStatus = ({ connectionStatus, currentText }) => {
  const getConnectionStatusColor = () => {
    switch (connectionStatus) {
      case 'connected': return 'text-green-600';
      case 'connecting': return 'text-yellow-600';
      case 'disconnected': return 'text-red-600';
      default: return 'text-gray-500';
    }
  };

  const getConnectionStatusText = () => {
    switch (connectionStatus) {
      case 'connected': return currentText.connected;
      case 'connecting': return currentText.connecting;
      case 'disconnected': return currentText.disconnected;
      default: return currentText.disconnected;
    }
  };

  return (
    <div className="flex items-center justify-center sm:justify-start space-x-2 sm:space-x-3 text-xs sm:text-sm">
      <div className={`flex items-center space-x-1 ${getConnectionStatusColor()}`}>
        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-current animate-pulse"></div>
        <span className="font-medium">{getConnectionStatusText()}</span>
      </div>
      <span className="text-gray-400 hidden sm:inline">•</span>
      <span className="text-gray-600 hidden sm:inline">Est. 1996 • Almaty, Kazakhstan</span>
    </div>
  );
};

export default ConnectionStatus;