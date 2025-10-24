import React, { useState, useEffect } from 'react';
import { getAvailableModels } from '../services/api';
import { ReactComponent as ChevronDownIcon } from './icons/chevron-down.svg';
import { ReactComponent as CheckCircleFilledIcon } from './icons/check-circle-filled.svg';

const ModelSelector = () => {
  const [models, setModels] = useState([]);
  const [currentModel, setCurrentModel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    fetchModels();
  }, []);

  const fetchModels = async () => {
    try {
      setLoading(true);
      const response = await getAvailableModels();
      if (response.success) {
        setModels(response.models);
        setCurrentModel(response.current_model);
      }
    } catch (err) {
      console.error('Error fetching models:', err);
      setError('Unable to fetch available models');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-3 mb-4">
        <div className="flex items-center justify-center">
          <div className="animate-pulse text-sm text-gray-400">Loading models...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
        <p className="text-sm text-red-600">{error}</p>
      </div>
    );
  }

  const currentModelData = models.find(m => m.id === currentModel);

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
      {/* Compact View - Always Visible */}
      {currentModelData && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between hover:bg-gray-50 rounded-lg p-2 -m-2 transition-colors"
        >
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                Active
              </span>
              <span className="font-semibold text-gray-900">
                {currentModelData.name}
              </span>
              <span className="text-sm text-gray-500">
                by {currentModelData.provider}
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
              {currentModelData.type === 'local' ? '📦 Local' : '☁️ API'}
            </span>
            <ChevronDownIcon
              className={`w-5 h-5 text-gray-400 transition-transform ${
                isExpanded ? 'transform rotate-180' : ''
              }`}
            />
          </div>
        </button>
      )}

      {/* Expanded View */}
      {isExpanded && currentModelData && (
        <div className="mt-4 pt-4 border-t border-gray-200 animate-fade-in">
          <div className="space-y-3">
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-1">Description</h4>
              <p className="text-sm text-gray-600 leading-relaxed">
                {currentModelData.description}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                {currentModelData.type === 'local' ? '📦 Local' : '☁️ API'}
              </span>
              {currentModelData.requires_api_key && (
                <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
                  🔑 Requires API Key
                </span>
              )}
            </div>
          </div>

          {/* Show all available models */}
          {models.length > 1 && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="mb-3">
                <h4 className="text-sm font-semibold text-gray-700">
                  All Available Models ({models.length})
                </h4>
                <p className="text-xs text-gray-500 mt-1">
                  Model selection is controlled on the server side. Configure which model to use in your backend settings.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {models.map((model) => (
                  <div
                    key={model.id}
                    className={`p-3 rounded-md border ${
                      model.id === currentModel
                        ? 'bg-blue-50 border-blue-200'
                        : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-sm text-gray-900">
                          {model.name}
                        </p>
                        <p className="text-xs text-gray-500">{model.provider}</p>
                      </div>
                      {model.id === currentModel && (
                        <CheckCircleFilledIcon className="w-5 h-5 text-blue-600" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ModelSelector;