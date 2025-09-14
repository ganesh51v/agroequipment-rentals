const Booking = require('../models/Booking');
const Equipment = require('../models/Equipment');
const User = require('../models/User');

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private
const createBooking = async (req, res) => {
  try {
    console.log('Booking request body:', req.body);
    console.log('User ID from token:', req.user.id);
    const {
      equipment,
      startDate,
      endDate,
      totalPrice,
      address,
      phone,
      notes
    } = req.body;

    // Validate address presence
    if (!address || address.trim() === '') {
      return res.status(400).json({ message: 'Please add delivery address' });
    }

    // Validate phone presence
    if (!phone || phone.trim() === '') {
      return res.status(400).json({ message: 'Please add contact phone number' });
    }

    console.log('Extracted fields:', { equipment, startDate, endDate, totalPrice, address, phone, notes });

    // Check if equipment exists
    const equipmentExists = await Equipment.findById(equipment);
    if (!equipmentExists) {
      return res.status(404).json({ message: 'Equipment not found' });
    }

    // Check availability
    const overlappingBookings = await Booking.find({
      equipment,
      status: { $in: ['confirmed', 'pending'] },
      $or: [
        { startDate: { $lte: endDate }, endDate: { $gte: startDate } }
      ]
    });

    if (overlappingBookings.length > 0) {
      return res.status(400).json({ message: 'Equipment not available for selected dates' });
    }

    const booking = await Booking.create({
      user: req.user.id,
      equipment,
      startDate,
      endDate,
      totalPrice,
      address: address,
      phone: phone,
      notes
    });

    const populatedBooking = await Booking.findById(booking._id)
      .populate('user', 'name email phone')
      .populate('equipment', 'name images pricePerDay');

    res.status(201).json({
      success: true,
      booking: populatedBooking
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user bookings
// @route   GET /api/bookings/mybookings
// @access  Private
const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id })
      .populate('equipment', 'name images pricePerDay')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: bookings.length,
      bookings
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all bookings (Admin)
// @route   GET /api/bookings
// @access  Private/Admin
const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({})
      .populate('user', 'name email phone')
      .populate('equipment', 'name images')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: bookings.length,
      bookings
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single booking
// @route   GET /api/bookings/:id
// @access  Private
const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('user', 'name email phone address')
      .populate('equipment');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Make sure user owns booking or is admin
    if (booking.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ message: 'Not authorized' });
    }

    res.json({
      success: true,
      booking
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update booking status
// @route   PUT /api/bookings/:id/status
// @access  Private/Admin
const updateBookingStatus = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    booking.status = req.body.status || booking.status;
    await booking.save();

    const updatedBooking = await Booking.findById(booking._id)
      .populate('user', 'name email')
      .populate('equipment', 'name');

    res.json({
      success: true,
      booking: updatedBooking
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createBooking,
  getMyBookings,
  getAllBookings,
  getBookingById,
  updateBookingStatus
};
