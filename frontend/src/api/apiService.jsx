import axios from 'axios';

// --- Configuration ---
// Create a pre-configured axios instance for all API calls.
// The Vite proxy will handle forwarding /api requests to the Node.js backend.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : '/api',
  withCredentials: true, 
});

// --- API Functions ---

/**
 * Fetches the user's prediction history.
 */
export const getHistory = async () => {
  const response = await api.get('/history');
  return response.data;
};

/**
 * Deletes all of the user's prediction history.
 */
export const deleteHistory = async () => {
  const response = await api.delete('/history');
  return response.data;
};

/**
 * Requests the user's history to be exported via email.
 */
export const exportHistory = async () => {
  const response = await api.post('/history/export', {});
  return response.data;
};

/**
 * Submits an image for prediction.
 * @param {File} imageFile - The image file from the user's input.
 */
export const getPrediction = async (imageFile) => {
  const formData = new FormData();
  formData.append('image', imageFile);

  const response = await api.post('/predict', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

/**
 * Fetches personalized recommendations based on user history.
 */
export const getRecommendations = async () => {
  const response = await api.get('/recommendations');
  return response.data;
};

/**
 * Fetches dashboard stats (Bloom Score, charts, timeline).
 */
export const getDashboardStats = async () => {
  const response = await api.get('/dashboard/stats');
  return response.data;
};

/**
 * Fetches the auto-generated skincare routine.
 */
export const getRoutine = async () => {
  const response = await api.get('/routine');
  return response.data;
};

/**
 * Tracks a routine completion (AM or PM).
 */
export const trackRoutine = async (timeOfDay) => {
  const response = await api.post('/routine/track', { timeOfDay });
  return response.data;
};