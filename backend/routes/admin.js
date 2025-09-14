const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/auth');
const { getDashboardStats, getAllBookings, manageEquipment, manageUsers } = require('../controllers/adminController');

// Admin only routes
router.get('/dashboard', protect, admin, getDashboardStats);
router.get('/bookings', protect, admin, getAllBookings);
router.put('/equipment/:id', protect, admin, manageEquipment);
router.put('/users/:id', protect, admin, manageUsers);

module.exports = router;
