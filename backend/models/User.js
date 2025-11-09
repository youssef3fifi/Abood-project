const bcrypt = require('bcryptjs');
const { generateId } = require('../utils/idGenerator');

// In-memory storage
const users = [];

class User {
  constructor(data) {
    this._id = data._id || generateId();
    this.name = data.name ? data.name.trim() : '';
    this.email = data.email ? data.email.toLowerCase().trim() : '';
    this.password = data.password || '';
    this.phone = data.phone ? data.phone.trim() : '';
    this.address = data.address ? data.address.trim() : '';
    this.createdAt = data.createdAt || new Date();
  }

  // Validation
  validate() {
    if (!this.name || this.name.length === 0) {
      throw new Error('Please provide a name');
    }
    if (this.name.length > 50) {
      throw new Error('Name cannot be more than 50 characters');
    }
    if (!this.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email)) {
      throw new Error('Please provide a valid email');
    }
    if (!this.password || this.password.length < 6) {
      throw new Error('Password must be at least 6 characters');
    }
  }

  // Hash password
  async hashPassword() {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }

  // Compare password
  async comparePassword(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
  }

  // Convert to JSON (exclude password by default)
  toJSON(includePassword = false) {
    const obj = {
      _id: this._id,
      name: this.name,
      email: this.email,
      phone: this.phone,
      address: this.address,
      createdAt: this.createdAt
    };
    if (includePassword) {
      obj.password = this.password;
    }
    return obj;
  }
}

// Static methods for CRUD operations
User.findOne = async (query) => {
  if (query.email) {
    return users.find(u => u.email === query.email.toLowerCase()) || null;
  }
  return null;
};

User.findById = async (id, options = {}) => {
  const user = users.find(u => u._id === id) || null;
  // Handle select option for password
  if (user && options.select === '+password') {
    return user; // Return with password
  }
  return user;
};

User.create = async (data) => {
  const user = new User(data);
  user.validate();
  
  // Check if email already exists
  const exists = await User.findOne({ email: user.email });
  if (exists) {
    throw new Error('User already exists with this email');
  }
  
  await user.hashPassword();
  users.push(user);
  return user;
};

// Get all users (for internal use)
User.getAll = () => users;

// Clear all users (for testing/reset)
User.clear = () => {
  users.length = 0;
};

module.exports = User;
