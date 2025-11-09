// Main JavaScript file with common utilities and event handlers

// Utility functions
const Utils = {
  // Format price
  formatPrice(price) {
    return `$${price.toLocaleString()}`;
  },

  // Format date
  formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  },

  // Show loading spinner
  showLoading(element) {
    if (element) {
      element.innerHTML = '<div class="loading-spinner"></div>';
    }
  },

  // Show error message
  showError(message, containerId = 'error-container') {
    const container = document.getElementById(containerId);
    if (container) {
      container.innerHTML = `
        <div class="alert alert-error">
          <span class="alert-icon">⚠</span>
          <span class="alert-message">${message}</span>
        </div>
      `;
      container.style.display = 'block';
      
      // Auto-hide after 5 seconds
      setTimeout(() => {
        container.style.display = 'none';
      }, 5000);
    } else {
      alert(message);
    }
  },

  // Show success message
  showSuccess(message, containerId = 'success-container') {
    const container = document.getElementById(containerId);
    if (container) {
      container.innerHTML = `
        <div class="alert alert-success">
          <span class="alert-icon">✓</span>
          <span class="alert-message">${message}</span>
        </div>
      `;
      container.style.display = 'block';
      
      // Auto-hide after 5 seconds
      setTimeout(() => {
        container.style.display = 'none';
      }, 5000);
    } else {
      alert(message);
    }
  },

  // Validate email
  isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  },

  // Validate phone
  isValidPhone(phone) {
    const re = /^[\d\s\-\+\(\)]+$/;
    return re.test(phone) && phone.replace(/\D/g, '').length >= 10;
  }
};

// Mobile menu toggle
document.addEventListener('DOMContentLoaded', () => {
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const navLinks = document.querySelector('.nav-links');

  if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener('click', () => {
      navLinks.classList.toggle('active');
    });
  }

  // Close mobile menu when clicking outside
  document.addEventListener('click', (e) => {
    if (navLinks && navLinks.classList.contains('active')) {
      if (!e.target.closest('.navbar')) {
        navLinks.classList.remove('active');
      }
    }
  });
});

// Modal functions
const Modal = {
  open(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.style.display = 'flex';
      document.body.style.overflow = 'hidden';
    }
  },

  close(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.style.display = 'none';
      document.body.style.overflow = 'auto';
    }
  },

  closeOnOutsideClick(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          this.close(modalId);
        }
      });
    }
  }
};

// Initialize modals
document.addEventListener('DOMContentLoaded', () => {
  // Setup close buttons
  document.querySelectorAll('.modal-close').forEach(btn => {
    btn.addEventListener('click', () => {
      const modal = btn.closest('.modal');
      if (modal) {
        Modal.close(modal.id);
      }
    });
  });

  // Setup outside click closing
  document.querySelectorAll('.modal').forEach(modal => {
    Modal.closeOnOutsideClick(modal.id);
  });
});

// Smooth scroll for anchor links
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href !== '#' && href !== '#!') {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      }
    });
  });
});

// Scroll to top button
document.addEventListener('DOMContentLoaded', () => {
  const scrollTopBtn = document.getElementById('scroll-top-btn');
  
  if (scrollTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.pageYOffset > 300) {
        scrollTopBtn.style.display = 'block';
      } else {
        scrollTopBtn.style.display = 'none';
      }
    });

    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
});
