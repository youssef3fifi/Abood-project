const mongoose = require('mongoose');

const packageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a package name'],
    trim: true,
    maxlength: [100, 'Name cannot be more than 100 characters']
  },
  destination: {
    type: String,
    required: [true, 'Please provide a destination'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please provide a description'],
    maxlength: [2000, 'Description cannot be more than 2000 characters']
  },
  price: {
    type: Number,
    required: [true, 'Please provide a price'],
    min: [0, 'Price cannot be negative']
  },
  duration: {
    type: Number,
    required: [true, 'Please provide duration in days'],
    min: [1, 'Duration must be at least 1 day']
  },
  maxPeople: {
    type: Number,
    required: [true, 'Please provide maximum number of people'],
    min: [1, 'Maximum people must be at least 1']
  },
  images: [{
    type: String
  }],
  includes: [{
    type: String
  }],
  excludes: [{
    type: String
  }],
  itinerary: [{
    day: Number,
    title: String,
    description: String
  }],
  available: {
    type: Boolean,
    default: true
  },
  rating: {
    type: Number,
    default: 0,
    min: [0, 'Rating must be at least 0'],
    max: [5, 'Rating cannot be more than 5']
  },
  category: {
    type: String,
    enum: ['adventure', 'relaxation', 'cultural', 'family', 'luxury', 'budget'],
    default: 'adventure'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Package', packageSchema);
