const express = require('express');
const router = express.Router();
const { getUserProfile, updateUserProfile, getAllUsers } = require('../controllers/userController');
const { protect, admin } = require('../middleware/auth');

// Public routes
router.get('/', getAllUsers);

// Protected routes
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);

module.exports = router;
