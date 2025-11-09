const express = require('express');
const router = express.Router();
const {
  createBooking,
  getUserBookings,
  getMyBookings,
  getBooking,
  updateBooking,
  cancelBooking
} = require('../controllers/bookingController');
const { protect } = require('../middleware/auth');

// All booking routes require authentication
router.use(protect);

router.route('/')
  .post(createBooking);

router.get('/my-bookings', getMyBookings);

router.get('/user/:userId', getUserBookings);

router.route('/:id')
  .get(getBooking)
  .put(updateBooking)
  .delete(cancelBooking);

module.exports = router;
