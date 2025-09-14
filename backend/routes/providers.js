const express = require('express');
const router = express.Router();
const { getAllProviders, getProviderProfile, updateProviderProfile } = require('../controllers/providerController');
const { protect, authorize } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

// Setup multer for avatar uploads
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'backend/public/uploads/');
  },
  filename: function(req, file, cb) {
    cb(null, `${Date.now()}${path.extname(file.originalname)}`);
  }
});

const fileFilter = (req, file, cb) => {
  // Accept only image files
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

const upload = multer({ storage, fileFilter });

router.route('/')
  .get(getAllProviders);

// Protected routes for provider profile
router.get('/profile', protect, authorize('provider'), getProviderProfile);
router.put('/profile', protect, authorize('provider'), upload.single('avatar'), updateProviderProfile);

module.exports = router;
