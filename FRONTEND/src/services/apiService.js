import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth tokens if needed
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

// API Service methods
const apiService = {
  // Health check
  getHealth: () => api.get('/health'),

  // Donation tracking
  getCurrentDonations: () => api.get('/donations/current'),
  
  // Impact statistics
  getImpactStatistics: () => api.get('/impact/statistics'),
  
  // Program locations
  getProgramLocations: () => api.get('/programs/locations'),

  // Contact form
  submitContact: (contactData) => api.post('/contact', contactData),
  
  // Newsletter subscription
  subscribeNewsletter: (newsletterData) => api.post('/newsletter', newsletterData),
  
  // Volunteer application
  submitVolunteer: (volunteerData) => api.post('/volunteer', volunteerData),
  
  // Donation
  submitDonation: (donationData) => api.post('/donation', donationData),
};

export default apiService;