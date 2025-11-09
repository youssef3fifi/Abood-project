// API utility functions for making HTTP requests

const API = {
  // Base URL from config
  baseURL: CONFIG.API_BASE_URL,

  // Get auth token from localStorage
  getToken() {
    return localStorage.getItem('token');
  },

  // Get auth headers
  getAuthHeaders() {
    const token = this.getToken();
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  },

  // Generic request method
  async request(endpoint, options = {}) {
    try {
      const url = `${this.baseURL}${endpoint}`;
      const config = {
        ...options,
        headers: {
          ...this.getAuthHeaders(),
          ...options.headers
        }
      };

      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Request failed');
      }

      return data;
    } catch (error) {
      console.error('API Request Error:', error);
      throw error;
    }
  },

  // GET request
  async get(endpoint) {
    return this.request(endpoint, { method: 'GET' });
  },

  // POST request
  async post(endpoint, body) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(body)
    });
  },

  // PUT request
  async put(endpoint, body) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body)
    });
  },

  // DELETE request
  async delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  },

  // Authentication APIs
  auth: {
    async register(userData) {
      return API.post('/auth/register', userData);
    },

    async login(credentials) {
      return API.post('/auth/login', credentials);
    },

    async getMe() {
      return API.get('/auth/me');
    }
  },

  // Package APIs
  packages: {
    async getAll(filters = {}) {
      const queryString = new URLSearchParams(filters).toString();
      const endpoint = queryString ? `/packages?${queryString}` : '/packages';
      return API.get(endpoint);
    },

    async getById(id) {
      return API.get(`/packages/${id}`);
    }
  },

  // Booking APIs
  bookings: {
    async create(bookingData) {
      return API.post('/bookings', bookingData);
    },

    async getMyBookings() {
      return API.get('/bookings/my-bookings');
    },

    async getById(id) {
      return API.get(`/bookings/${id}`);
    },

    async update(id, bookingData) {
      return API.put(`/bookings/${id}`, bookingData);
    },

    async cancel(id) {
      return API.delete(`/bookings/${id}`);
    }
  },

  // Contact API
  contact: {
    async submit(contactData) {
      return API.post('/contact', contactData);
    }
  }
};
