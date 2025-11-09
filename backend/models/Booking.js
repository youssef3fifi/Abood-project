const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  package: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Package',
    required: true
  },
  startDate: {
    type: Date,
    required: [true, 'Please provide a start date']
  },
  numberOfPeople: {
    type: Number,
    required: [true, 'Please provide number of people'],
    min: [1, 'Number of people must be at least 1']
  },
  totalPrice: {
    type: Number,
    required: [true, 'Please provide total price'],
    min: [0, 'Total price cannot be negative']
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'pending'
  },
  specialRequests: {
    type: String,
    maxlength: [500, 'Special requests cannot be more than 500 characters']
  },
  contactPhone: {
    type: String,
    required: [true, 'Please provide contact phone']
  },
  contactEmail: {
    type: String,
    required: [true, 'Please provide contact email']
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt timestamp before saving
bookingSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Booking', bookingSchema);
