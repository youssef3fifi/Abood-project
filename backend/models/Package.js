const { generateId } = require('../utils/idGenerator');

// In-memory storage
const packages = [];

class Package {
  constructor(data) {
    this._id = data._id || generateId();
    this.name = data.name ? data.name.trim() : '';
    this.destination = data.destination ? data.destination.trim() : '';
    this.description = data.description || '';
    this.price = data.price || 0;
    this.duration = data.duration || 1;
    this.maxPeople = data.maxPeople || 1;
    this.images = data.images || [];
    this.includes = data.includes || [];
    this.excludes = data.excludes || [];
    this.itinerary = data.itinerary || [];
    this.available = data.available !== undefined ? data.available : true;
    this.rating = data.rating || 0;
    this.category = data.category || 'adventure';
    this.createdAt = data.createdAt || new Date();
  }

  // Validation
  validate() {
    if (!this.name || this.name.length === 0) {
      throw new Error('Please provide a package name');
    }
    if (this.name.length > 100) {
      throw new Error('Name cannot be more than 100 characters');
    }
    if (!this.destination) {
      throw new Error('Please provide a destination');
    }
    if (!this.description) {
      throw new Error('Please provide a description');
    }
    if (this.description.length > 2000) {
      throw new Error('Description cannot be more than 2000 characters');
    }
    if (this.price < 0) {
      throw new Error('Price cannot be negative');
    }
    if (this.duration < 1) {
      throw new Error('Duration must be at least 1 day');
    }
    if (this.maxPeople < 1) {
      throw new Error('Maximum people must be at least 1');
    }
    if (this.rating < 0 || this.rating > 5) {
      throw new Error('Rating must be between 0 and 5');
    }
    const validCategories = ['adventure', 'relaxation', 'cultural', 'family', 'luxury', 'budget'];
    if (!validCategories.includes(this.category)) {
      throw new Error('Invalid category');
    }
  }

  toJSON() {
    return {
      _id: this._id,
      name: this.name,
      destination: this.destination,
      description: this.description,
      price: this.price,
      duration: this.duration,
      maxPeople: this.maxPeople,
      images: this.images,
      includes: this.includes,
      excludes: this.excludes,
      itinerary: this.itinerary,
      available: this.available,
      rating: this.rating,
      category: this.category,
      createdAt: this.createdAt
    };
  }
}

// Static methods for CRUD operations
Package.find = async (filter = {}) => {
  let results = [...packages];

  // Apply filters
  if (filter.available !== undefined) {
    results = results.filter(p => p.available === filter.available);
  }

  if (filter.destination) {
    const regex = new RegExp(filter.destination.$regex || filter.destination, 'i');
    results = results.filter(p => regex.test(p.destination));
  }

  if (filter.category) {
    results = results.filter(p => p.category === filter.category);
  }

  if (filter.price) {
    if (filter.price.$gte !== undefined) {
      results = results.filter(p => p.price >= filter.price.$gte);
    }
    if (filter.price.$lte !== undefined) {
      results = results.filter(p => p.price <= filter.price.$lte);
    }
  }

  if (filter.duration) {
    if (filter.duration.$gte !== undefined) {
      results = results.filter(p => p.duration >= filter.duration.$gte);
    }
    if (filter.duration.$lte !== undefined) {
      results = results.filter(p => p.duration <= filter.duration.$lte);
    }
  }

  return results;
};

Package.findById = async (id) => {
  return packages.find(p => p._id === id) || null;
};

Package.create = async (data) => {
  const pkg = new Package(data);
  pkg.validate();
  packages.push(pkg);
  return pkg;
};

Package.findByIdAndUpdate = async (id, data, options = {}) => {
  const index = packages.findIndex(p => p._id === id);
  if (index === -1) return null;

  const pkg = packages[index];
  Object.assign(pkg, data);
  
  if (options.runValidators) {
    pkg.validate();
  }

  return pkg;
};

Package.findByIdAndDelete = async (id) => {
  const index = packages.findIndex(p => p._id === id);
  if (index === -1) return null;
  
  const pkg = packages[index];
  packages.splice(index, 1);
  return pkg;
};

Package.deleteMany = async () => {
  packages.length = 0;
};

Package.insertMany = async (data) => {
  const inserted = [];
  for (const item of data) {
    const pkg = new Package(item);
    packages.push(pkg);
    inserted.push(pkg);
  }
  return inserted;
};

// Helper to support mongoose-style chaining
Package.prototype.sort = function() {
  return this;
};

// Get all packages (for internal use)
Package.getAll = () => packages;

// Clear all packages (for testing/reset)
Package.clear = () => {
  packages.length = 0;
};

module.exports = Package;
