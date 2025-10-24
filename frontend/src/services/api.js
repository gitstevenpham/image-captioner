import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Generate caption for an uploaded image
 * @param {File} imageFile - The image file to caption
 * @returns {Promise} Response with caption data
 */
export const generateCaption = async (imageFile) => {
  const formData = new FormData();
  formData.append('image', imageFile);

  try {
    const response = await api.post('/api/caption', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error generating caption:', error);
    throw error;
  }
};

/**
 * Submit a rating for a caption
 * @param {string} imageId - The image ID
 * @param {string} caption - The caption text
 * @param {number} rating - Rating value (1-5)
 * @returns {Promise} Response with rating confirmation
 */
export const submitRating = async (imageId, caption, rating) => {
  try {
    const response = await api.post('/api/rate', {
      image_id: imageId,
      caption: caption,
      rating: rating,
    });
    return response.data;
  } catch (error) {
    console.error('Error submitting rating:', error);
    throw error;
  }
};

/**
 * Get caption history
 * @param {number} limit - Number of records to retrieve (1-100)
 * @returns {Promise} Response with history data
 */
export const getCaptionHistory = async (limit = 50) => {
  try {
    const response = await api.get('/api/history', {
      params: { limit },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching history:', error);
    throw error;
  }
};

/**
 * Get ratings for a specific image
 * @param {string} imageId - The image ID
 * @returns {Promise} Response with ratings data
 */
export const getImageRatings = async (imageId) => {
  try {
    const response = await api.get(`/api/history/${imageId}/ratings`);
    return response.data;
  } catch (error) {
    console.error('Error fetching image ratings:', error);
    throw error;
  }
};

/**
 * Get available models and current model
 * @returns {Promise} Response with models data
 */
export const getAvailableModels = async () => {
  try {
    const response = await api.get('/api/models');
    return response.data;
  } catch (error) {
    console.error('Error fetching models:', error);
    throw error;
  }
};

/**
 * Health check endpoint
 * @returns {Promise} Response with health status
 */
export const healthCheck = async () => {
  try {
    const response = await api.get('/health');
    return response.data;
  } catch (error) {
    console.error('Error checking health:', error);
    throw error;
  }
};

export default api;
