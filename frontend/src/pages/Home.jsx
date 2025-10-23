import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import ImageUpload from '../components/ImageUpload';
import CaptionDisplay from '../components/CaptionDisplay';
import RatingComponent from '../components/RatingComponent';
import LoadingSpinner from '../components/LoadingSpinner';
import { generateCaption, submitRating } from '../services/api';
import { ReactComponent as ClockIcon } from '../components/icons/clock.svg';
import { ReactComponent as ErrorCircleIcon } from '../components/icons/error-circle.svg';
import { ReactComponent as RefreshIcon } from '../components/icons/refresh.svg';
import { ReactComponent as UploadCloudIcon } from '../components/icons/upload-cloud.svg';
import { ReactComponent as LightningIcon } from '../components/icons/lightning.svg';
import { ReactComponent as StarRatingIcon } from '../components/icons/star-rating.svg';

const Home = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [captionData, setCaptionData] = useState(null);
  const [error, setError] = useState(null);
  const imageUploadRef = useRef(null);

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
    // Clear the image upload component
    imageUploadRef.current?.clear();
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <header className="flex-none bg-white shadow-sm">
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
              <ClockIcon className="w-5 h-5 mr-2" />
              View History
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Image Upload */}
          <ImageUpload
            ref={imageUploadRef}
            onImageSelect={handleImageSelect}
            disabled={loading}
          />

          {/* Loading State */}
          {loading && <LoadingSpinner />}

          {/* Error State */}
          {error && !loading && (
            <div className="mt-8 bg-red-50 border border-red-200 rounded-lg p-6 animate-fade-in">
              <div className="flex items-start space-x-3">
                <ErrorCircleIcon className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
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
                  <RefreshIcon className="w-5 h-5 mr-2" />
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
                  <UploadCloudIcon className="w-6 h-6 text-blue-600" />
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
                  <LightningIcon className="w-6 h-6 text-green-600" />
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
                  <StarRatingIcon className="w-6 h-6 text-purple-600" />
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
      <footer className="flex-none bg-white border-t border-gray-200 mt-12">
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
