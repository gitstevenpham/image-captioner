import React, { useState } from 'react';

const RatingComponent = ({ onRate, disabled = false }) => {
  const [hoveredStar, setHoveredStar] = useState(0);
  const [selectedRating, setSelectedRating] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const handleStarClick = (rating) => {
    if (disabled || submitted) return;
    setSelectedRating(rating);
    setSubmitted(true);
    onRate(rating);
  };

  const handleStarHover = (rating) => {
    if (!submitted && !disabled) {
      setHoveredStar(rating);
    }
  };

  const handleMouseLeave = () => {
    if (!submitted && !disabled) {
      setHoveredStar(0);
    }
  };

  const getStarColor = (position) => {
    const activeRating = hoveredStar || selectedRating;
    return position <= activeRating ? 'text-yellow-400' : 'text-gray-300';
  };

  return (
    <div className="w-full max-w-2xl mx-auto mt-6">
      {!submitted ? (
        <div className="bg-white rounded-lg p-6 shadow-md border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
            How would you rate this caption?
          </h3>
          <div
            className="flex justify-center space-x-2"
            onMouseLeave={handleMouseLeave}
          >
            {[1, 2, 3, 4, 5].map((rating) => (
              <button
                key={rating}
                onClick={() => handleStarClick(rating)}
                onMouseEnter={() => handleStarHover(rating)}
                disabled={disabled}
                className={`transition-all transform hover:scale-110 ${
                  disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
                }`}
                aria-label={`Rate ${rating} stars`}
              >
                <svg
                  className={`w-12 h-12 transition-colors ${getStarColor(rating)}`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </button>
            ))}
          </div>
          <div className="mt-4 text-center text-sm text-gray-500">
            {hoveredStar > 0 && !selectedRating && (
              <span>
                {hoveredStar} star{hoveredStar > 1 ? 's' : ''}
              </span>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-green-50 rounded-lg p-6 shadow-md border border-green-200 animate-fade-in">
          <div className="flex items-center justify-center space-x-3">
            <svg
              className="w-8 h-8 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div>
              <p className="text-lg font-semibold text-green-800">
                Thank you for your feedback!
              </p>
              <p className="text-sm text-green-600 mt-1">
                You rated this caption {selectedRating} star{selectedRating > 1 ? 's' : ''}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RatingComponent;
