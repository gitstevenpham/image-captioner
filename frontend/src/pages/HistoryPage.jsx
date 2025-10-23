import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getCaptionHistory } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const HistoryPage = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({ total: 0, avgRating: 0 });

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getCaptionHistory(50);

      if (response.success) {
        setHistory(response.history || []);
        setStats({
          total: response.total_records || 0,
          avgRating: response.average_rating || 0,
        });
      } else {
        setError('Failed to fetch history');
      }
    } catch (err) {
      console.error('Error fetching history:', err);
      setError('Unable to load caption history. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <LoadingSpinner message="Loading history..." />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Home
          </Link>
          <h1 className="text-4xl font-bold text-gray-900">Caption History</h1>
          {stats.total > 0 && (
            <div className="mt-4 flex space-x-6">
              <div className="bg-white rounded-lg px-4 py-2 shadow">
                <p className="text-sm text-gray-600">Total Captions</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              {stats.avgRating > 0 && (
                <div className="bg-white rounded-lg px-4 py-2 shadow">
                  <p className="text-sm text-gray-600">Average Rating</p>
                  <p className="text-2xl font-bold text-gray-900 flex items-center">
                    {stats.avgRating.toFixed(1)}
                    <svg
                      className="w-5 h-5 text-yellow-400 ml-1"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800">{error}</p>
            <button
              onClick={fetchHistory}
              className="mt-2 text-red-600 hover:text-red-700 underline"
            >
              Try again
            </button>
          </div>
        )}

        {/* Empty State */}
        {!error && history.length === 0 && (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <svg
              className="w-16 h-16 text-gray-400 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No history yet
            </h3>
            <p className="text-gray-500 mb-4">
              Start by generating some captions!
            </p>
            <Link
              to="/"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-lg transition-colors"
            >
              Generate Caption
            </Link>
          </div>
        )}

        {/* History List */}
        {!error && history.length > 0 && (
          <div className="space-y-4">
            {history.map((item, index) => (
              <div
                key={item.image_id || index}
                className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-3">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {item.model_used || 'Unknown Model'}
                  </span>
                  <span className="text-sm text-gray-500">
                    {formatDate(item.created_at)}
                  </span>
                </div>
                <p className="text-gray-800 text-lg leading-relaxed">
                  {item.caption}
                </p>
                {item.image_id && (
                  <p className="mt-2 text-xs text-gray-400 font-mono">
                    ID: {item.image_id}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryPage;
