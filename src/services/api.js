import axios from 'axios';

/**
 * ORBIT API Service Client
 * Preconfigured Axios instance ready for REST API integration.
 * Currently decoupled from any backend implementation until the backend is developed.
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Request Interceptor: Attach authentication tokens when available
apiClient.interceptors.request.use(
  (config) => {
    try {
      const token = localStorage.getItem('orbit_auth_token');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch {
      // Storage access blocked or unavailable
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Standardize error handling and auth expiry handling
apiClient.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    const customError = {
      message: error.response?.data?.message || error.message || 'An unexpected error occurred',
      status: error.response?.status,
      data: error.response?.data,
    };

    if (error.response?.status === 401) {
      try {
        localStorage.removeItem('orbit_auth_token');
      } catch {
        // Ignored
      }
      // Future redirect handling or auth event dispatch can be hooked here
    }

    return Promise.reject(customError);
  }
);

export const api = {
  get: (url, config) => apiClient.get(url, config),
  post: (url, data, config) => apiClient.post(url, data, config),
  put: (url, data, config) => apiClient.put(url, data, config),
  patch: (url, data, config) => apiClient.patch(url, data, config),
  delete: (url, config) => apiClient.delete(url, config),
};

export default api;
