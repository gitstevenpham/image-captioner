import React, { useState } from 'react';
import { ReactComponent as StarIcon } from './icons/star.svg';
import { ReactComponent as CheckCircleIcon } from './icons/check-circle.svg';

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
                <StarIcon
                  className={`w-12 h-12 transition-colors ${getStarColor(rating)}`}
                />
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
            <CheckCircleIcon className="w-8 h-8 text-green-600" />
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
