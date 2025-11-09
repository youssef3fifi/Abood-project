const Booking = require('../models/Booking');
const Package = require('../models/Package');

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private
const createBooking = async (req, res) => {
  try {
    const { packageId, startDate, numberOfPeople, specialRequests, contactPhone, contactEmail } = req.body;

    // Verify package exists
    const package = await Package.findById(packageId);

    if (!package) {
      return res.status(404).json({
        success: false,
        message: 'Package not found'
      });
    }

    if (!package.available) {
      return res.status(400).json({
        success: false,
        message: 'Package is not available'
      });
    }

    // Check if number of people exceeds maximum
    if (numberOfPeople > package.maxPeople) {
      return res.status(400).json({
        success: false,
        message: `Maximum ${package.maxPeople} people allowed for this package`
      });
    }

    // Calculate total price
    const totalPrice = package.price * numberOfPeople;

    // Create booking
    const booking = await Booking.create({
      user: req.user._id,
      package: packageId,
      startDate,
      numberOfPeople,
      totalPrice,
      specialRequests,
      contactPhone,
      contactEmail
    });

    // Populate package details
    await booking.populate('package');

    res.status(201).json({
      success: true,
      data: booking
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error while creating booking'
    });
  }
};

// @desc    Get user bookings
// @route   GET /api/bookings/user/:userId
// @access  Private
const getUserBookings = async (req, res) => {
  try {
    // Users can only view their own bookings
    if (req.user._id.toString() !== req.params.userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view these bookings'
      });
    }

    const bookings = await Booking.find({ user: req.params.userId })
      .populate('package')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching bookings'
    });
  }
};

// @desc    Get all bookings for current user
// @route   GET /api/bookings/my-bookings
// @access  Private
const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('package')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching bookings'
    });
  }
};

// @desc    Get single booking
// @route   GET /api/bookings/:id
// @access  Private
const getBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check if user owns this booking
    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this booking'
      });
    }

    // Populate package data
    await booking.populate('package');

    res.status(200).json({
      success: true,
      data: booking
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching booking'
    });
  }
};

// @desc    Update booking
// @route   PUT /api/bookings/:id
// @access  Private
const updateBooking = async (req, res) => {
  try {
    let booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check if user owns this booking
    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this booking'
      });
    }

    // Don't allow updates to cancelled bookings
    if (booking.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Cannot update a cancelled booking'
      });
    }

    // Update allowed fields
    const { startDate, numberOfPeople, specialRequests, contactPhone, contactEmail } = req.body;

    if (startDate) booking.startDate = startDate;
    if (numberOfPeople) {
      const package = await Package.findById(booking.package);
      if (numberOfPeople > package.maxPeople) {
        return res.status(400).json({
          success: false,
          message: `Maximum ${package.maxPeople} people allowed`
        });
      }
      booking.numberOfPeople = numberOfPeople;
      booking.totalPrice = package.price * numberOfPeople;
    }
    if (specialRequests !== undefined) booking.specialRequests = specialRequests;
    if (contactPhone) booking.contactPhone = contactPhone;
    if (contactEmail) booking.contactEmail = contactEmail;

    await booking.save();
    await booking.populate('package');

    res.status(200).json({
      success: true,
      data: booking
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating booking'
    });
  }
};

// @desc    Cancel booking
// @route   DELETE /api/bookings/:id
// @access  Private
const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check if user owns this booking
    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this booking'
      });
    }

    // Update status to cancelled instead of deleting
    booking.status = 'cancelled';
    await booking.save();

    res.status(200).json({
      success: true,
      message: 'Booking cancelled successfully',
      data: booking
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error while cancelling booking'
    });
  }
};

module.exports = {
  createBooking,
  getUserBookings,
  getMyBookings,
  getBooking,
  updateBooking,
  cancelBooking
};
