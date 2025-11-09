// Authentication utilities

const Auth = {
  // Check if user is logged in
  isLoggedIn() {
    return !!localStorage.getItem('token');
  },

  // Get current user data
  getUser() {
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
  },

  // Save user data and token
  saveUser(userData) {
    localStorage.setItem('token', userData.token);
    localStorage.setItem('user', JSON.stringify({
      _id: userData._id,
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
      address: userData.address
    }));
  },

  // Logout user
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = 'index.html';
  },

  // Protect page (redirect to home if not logged in)
  requireAuth() {
    if (!this.isLoggedIn()) {
      alert('Please log in to access this page');
      window.location.href = 'index.html';
      return false;
    }
    return true;
  },

  // Update navigation based on auth status
  updateNavigation() {
    const user = this.getUser();
    const authButtons = document.getElementById('auth-buttons');
    const userMenu = document.getElementById('user-menu');

    if (this.isLoggedIn() && user) {
      if (authButtons) authButtons.style.display = 'none';
      if (userMenu) {
        userMenu.style.display = 'block';
        const userName = userMenu.querySelector('.user-name');
        if (userName) userName.textContent = user.name;
      }
    } else {
      if (authButtons) authButtons.style.display = 'flex';
      if (userMenu) userMenu.style.display = 'none';
    }
  },

  // Initialize auth on page load
  init() {
    this.updateNavigation();

    // Add logout event listener
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.logout();
      });
    }
  }
};

// Initialize auth when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  Auth.init();
});
