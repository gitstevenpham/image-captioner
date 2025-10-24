import React, { useState, useEffect, useMemo } from 'react';
import { getAvailableModels } from '../services/api';

const LoadingSpinner = ({ message = 'Generating caption...' }) => {
  const [currentModel, setCurrentModel] = useState(null);

  // Fetch current model on mount
  useEffect(() => {
    const fetchCurrentModel = async () => {
      try {
        const response = await getAvailableModels();
        if (response.success) {
          setCurrentModel(response.current_model);
        }
      } catch (err) {
        console.error('Error fetching current model:', err);
      }
    };
    fetchCurrentModel();
  }, []);

  // Determine the expected time based on the model
  const expectedTime = useMemo(() => {
    if (currentModel === 'gemini') {
      return 'This usually takes less than 15 seconds';
    }
    return 'This usually takes less than 5 seconds';
  }, [currentModel]);

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="relative w-20 h-20">
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="w-20 h-20 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
        </div>
      </div>
      <p className="mt-6 text-gray-600 text-lg animate-pulse">{message}</p>
      <p className="mt-2 text-sm text-gray-400">{expectedTime}</p>
    </div>
  );
};

export default LoadingSpinner;
