import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ImageUpload from '../components/ImageUpload';
import CaptionDisplay from '../components/CaptionDisplay';
import RatingComponent from '../components/RatingComponent';
import LoadingSpinner from '../components/LoadingSpinner';
import { generateCaption, submitRating } from '../services/api';

const Home = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [captionData, setCaptionData] = useState(null);
  const [error, setError] = useState(null);

  const handleImageSelect = async (file) => {
    setSelectedImage(file);
    setCaptionData(null);
    setError(null);

    if (file) {
      await handleGenerateCaption(file);
    }
  };

  const handleGenerateCaption = async (file) => {
    try {
      setLoading(true);
      setError(null);

      const response = await generateCaption(file);

      if (response.success) {
        setCaptionData({
          caption: response.caption,
          imageId: response.image_id,
          model: response.model,
        });
      } else {
        setError('Failed to generate caption. Please try again.');
      }
    } catch (err) {
      console.error('Error generating caption:', err);
      setError(
        err.response?.data?.error ||
        'Unable to generate caption. Please check if the backend server is running.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRate = async (rating) => {
    if (!captionData) return;

    try {
      await submitRating(
        captionData.imageId,
        captionData.caption,
        rating
      );
    } catch (err) {
      console.error('Error submitting rating:', err);
    }
  };

  const handleReset = () => {
    setSelectedImage(null);
    setCaptionData(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                AI Image Caption Generator
              </h1>
              <p className="text-gray-600 mt-1">
                Upload an image and let AI describe it for you
              </p>
            </div>
            <Link
              to="/history"
              className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors shadow-sm"
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
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              View History
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Image Upload */}
          <ImageUpload
            onImageSelect={handleImageSelect}
            disabled={loading}
          />

          {/* Loading State */}
          {loading && <LoadingSpinner />}

          {/* Error State */}
          {error && !loading && (
            <div className="mt-8 bg-red-50 border border-red-200 rounded-lg p-6 animate-fade-in">
              <div className="flex items-start space-x-3">
                <svg
                  className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <div>
                  <h3 className="text-lg font-semibold text-red-800">
                    Error
                  </h3>
                  <p className="text-red-700 mt-1">{error}</p>
                  <button
                    onClick={() => selectedImage && handleGenerateCaption(selectedImage)}
                    className="mt-3 text-red-600 hover:text-red-700 underline font-medium"
                  >
                    Try again
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Caption Display */}
          {captionData && !loading && (
            <>
              <CaptionDisplay
                caption={captionData.caption}
                modelUsed={captionData.model}
              />

              {/* Rating Component */}
              <RatingComponent onRate={handleRate} />

              {/* Reset Button */}
              <div className="mt-8 text-center">
                <button
                  onClick={handleReset}
                  className="inline-flex items-center px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors shadow-sm"
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
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  Generate Another Caption
                </button>
              </div>
            </>
          )}

          {/* Info Section */}
          {!selectedImage && !loading && (
            <div className="mt-12 grid md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <svg
                    className="w-6 h-6 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Upload Image
                </h3>
                <p className="text-sm text-gray-600">
                  Drag and drop or click to upload JPEG or PNG images
                </p>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <svg
                    className="w-6 h-6 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  AI Processing
                </h3>
                <p className="text-sm text-gray-600">
                  Advanced AI models analyze your image in under 5 seconds
                </p>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <svg
                    className="w-6 h-6 text-purple-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                    />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Rate & Improve
                </h3>
                <p className="text-sm text-gray-600">
                  Rate captions to help the system learn your preferences
                </p>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 py-6 text-center text-gray-600 text-sm">
          <p>
            Powered by AI vision models (BLIP & Gemini)
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
