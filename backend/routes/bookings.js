const express = require('express');
const router = express.Router();
const {
  getAllBookings,
  getBookingById,
  createBooking,
  updateBookingStatus,
  getMyBookings
} = require('../controllers/bookingController');
const { protect, authorize } = require('../middleware/auth');

router.route('/')
  .get(protect, getAllBookings)
  .post(protect, createBooking);

router.route('/mybookings')
  .get(protect, getMyBookings);

router.route('/:id')
  .get(protect, getBookingById)
  .put(protect, authorize('admin'), updateBookingStatus);

module.exports = router;
