// API Configuration
// Copy this file to config.js and update the API_BASE_URL with your backend server address

const CONFIG = {
  // For local development:
  // API_BASE_URL: 'http://localhost:3000/api'
  
  // For AWS EC2 deployment (replace with your EC2 public IP):
  // API_BASE_URL: 'http://54.123.45.67:3000/api'
  // API_BASE_URL: 'http://YOUR_EC2_PUBLIC_IP:3000/api'
  
  // For production with domain:
  // API_BASE_URL: 'https://api.yourdomain.com/api'
  
  API_BASE_URL: 'http://localhost:3000/api'
};

// Export for use in other JavaScript files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CONFIG;
}
