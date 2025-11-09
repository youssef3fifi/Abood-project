const { generateId } = require('../utils/idGenerator');
const Package = require('./Package');

// In-memory storage
const bookings = [];

class Booking {
  constructor(data) {
    this._id = data._id || generateId();
    this.user = data.user;
    this.package = data.package;
    this.startDate = data.startDate ? new Date(data.startDate) : null;
    this.numberOfPeople = data.numberOfPeople || 1;
    this.totalPrice = data.totalPrice || 0;
    this.status = data.status || 'pending';
    this.specialRequests = data.specialRequests || '';
    this.contactPhone = data.contactPhone || '';
    this.contactEmail = data.contactEmail || '';
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
    this._packageData = null; // For populated data
  }

  // Validation
  validate() {
    if (!this.user) {
      throw new Error('User is required');
    }
    if (!this.package) {
      throw new Error('Package is required');
    }
    if (!this.startDate) {
      throw new Error('Please provide a start date');
    }
    if (this.numberOfPeople < 1) {
      throw new Error('Number of people must be at least 1');
    }
    if (this.totalPrice < 0) {
      throw new Error('Total price cannot be negative');
    }
    if (!this.contactPhone) {
      throw new Error('Please provide contact phone');
    }
    if (!this.contactEmail) {
      throw new Error('Please provide contact email');
    }
    if (this.specialRequests && this.specialRequests.length > 500) {
      throw new Error('Special requests cannot be more than 500 characters');
    }
    const validStatuses = ['pending', 'confirmed', 'cancelled', 'completed'];
    if (!validStatuses.includes(this.status)) {
      throw new Error('Invalid status');
    }
  }

  // Update timestamp
  async save() {
    this.updatedAt = new Date();
    this.validate();
    return this;
  }

  // Populate package data
  async populate(field) {
    if (field === 'package' && this.package) {
      this._packageData = await Package.findById(this.package);
    }
    return this;
  }

  toJSON() {
    const obj = {
      _id: this._id,
      user: this.user,
      package: this._packageData || this.package,
      startDate: this.startDate,
      numberOfPeople: this.numberOfPeople,
      totalPrice: this.totalPrice,
      status: this.status,
      specialRequests: this.specialRequests,
      contactPhone: this.contactPhone,
      contactEmail: this.contactEmail,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
    return obj;
  }
}

// Static methods for CRUD operations
Booking.find = async (filter = {}) => {
  let results = [...bookings];

  if (filter.user) {
    results = results.filter(b => b.user.toString() === filter.user.toString());
  }

  if (filter.package) {
    results = results.filter(b => b.package.toString() === filter.package.toString());
  }

  if (filter.status) {
    results = results.filter(b => b.status === filter.status);
  }

  return results;
};

Booking.findById = async (id) => {
  return bookings.find(b => b._id === id) || null;
};

Booking.create = async (data) => {
  const booking = new Booking(data);
  booking.validate();
  bookings.push(booking);
  return booking;
};

// Helper methods for mongoose-style chaining
const createQueryChain = (results) => {
  return {
    _results: results,
    populate: async function(field) {
      if (field === 'package') {
        for (const booking of this._results) {
          await booking.populate('package');
        }
      }
      return this;
    },
    sort: function(sortStr) {
      if (sortStr === '-createdAt') {
        this._results.sort((a, b) => b.createdAt - a.createdAt);
      } else if (sortStr === 'createdAt') {
        this._results.sort((a, b) => a.createdAt - b.createdAt);
      }
      return this._results;
    }
  };
};

// Override find to support chaining
const originalFind = Booking.find;
Booking.find = async (filter = {}) => {
  const results = await originalFind(filter);
  const chain = createQueryChain(results);
  
  // Make chain then-able for await
  chain.then = async function(resolve) {
    return resolve(this._results);
  };
  
  return chain;
};

// Override findById to support chaining
const originalFindById = Booking.findById;
Booking.findById = async (id) => {
  const booking = await originalFindById(id);
  if (!booking) return null;
  
  return {
    ...booking,
    populate: async function(field) {
      await booking.populate(field);
      return booking;
    }
  };
};

// Get all bookings (for internal use)
Booking.getAll = () => bookings;

// Clear all bookings (for testing/reset)
Booking.clear = () => {
  bookings.length = 0;
};

module.exports = Booking;
