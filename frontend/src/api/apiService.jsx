import axios from 'axios';

// --- Configuration ---
// The base URL for all API requests.
// The Vite/CRA proxy will handle forwarding this to your Node.js backend.
const API_BASE_URL = '/api'; 

// --- Helper Function ---
// Gets the authentication token from localStorage to attach to requests.
const getAuthHeaders = () => {
  const token = localStorage.getItem('token'); // Or wherever you store your token
  return token ? { Authorization: `Bearer ${token}` } : {};
};


// --- API Functions ---

/**
 * Fetches the user's prediction history.
 */
export const getHistory = async () => {
  const response = await axios.get(`${API_BASE_URL}/history`, {
    headers: getAuthHeaders()
  });
  return response.data;
};

/**
 * Deletes all of the user's prediction history.
 */
export const deleteHistory = async () => {
  const response = await axios.delete(`${API_BASE_URL}/history`, {
    headers: getAuthHeaders()
  });
  return response.data;
};

/**
 * Requests the user's history to be exported via email.
 */
export const exportHistory = async () => {
  const response = await axios.post(`${API_BASE_URL}/history/export`, {}, {
    headers: getAuthHeaders()
  });
  return response.data;
};

/**
 * Submits an image for prediction.
 * @param {File} imageFile - The image file from the user's input.
 */
export const getPrediction = async (imageFile) => {
    const formData = new FormData();
    formData.append('image', imageFile);

    // --- THE FIX IS HERE ---
    // The URL endpoint must exactly match what is defined in your backend routes.
    // It should be '/predict', not '/predictable'.
    const response = await axios.post(`${API_BASE_URL}/predict`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
            ...getAuthHeaders(), // Adds the Authorization header
        }
    });
    return response.data;
};