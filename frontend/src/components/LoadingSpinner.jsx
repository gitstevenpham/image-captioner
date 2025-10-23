import React from 'react';

const LoadingSpinner = ({ message = 'Generating caption...' }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="relative w-20 h-20">
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="w-20 h-20 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
        </div>
      </div>
      <p className="mt-6 text-gray-600 text-lg animate-pulse">{message}</p>
      <p className="mt-2 text-sm text-gray-400">This usually takes less than 5 seconds</p>
    </div>
  );
};

export default LoadingSpinner;
