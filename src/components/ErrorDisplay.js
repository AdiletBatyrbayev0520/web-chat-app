import React from 'react';
import { AlertCircle } from 'lucide-react';

const ErrorDisplay = ({ error }) => {
  if (!error) return null;

  return (
    <div className="flex items-center space-x-2 sm:space-x-3 p-3 sm:p-4 bg-red-50 border-l-4 border-red-500 rounded-lg text-red-700 text-sm sm:text-base">
      <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
      <span className="font-medium">{error}</span>
    </div>
  );
};

export default ErrorDisplay;