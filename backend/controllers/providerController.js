const User = require('../models/User');

// @desc    Get all providers
// @route   GET /api/providers
// @access  Public
const getAllProviders = async (req, res) => {
  try {
    const providers = await User.find({ role: 'provider' }).select('-password');
    res.json({
      success: true,
      count: providers.length,
      providers
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get current provider profile
// @route   GET /api/providers/profile
// @access  Private (Provider only)
const getProviderProfile = async (req, res) => {
  try {
    const provider = await User.findById(req.user.id).select('-password');
    if (!provider) {
      return res.status(404).json({ message: 'Provider not found' });
    }
    res.json({
      success: true,
      provider
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update provider profile
// @route   PUT /api/providers/profile
// @access  Private (Provider only)
const updateProviderProfile = async (req, res) => {
  try {
    const { description } = req.body;

    const updateData = {};
    if (description !== undefined) {
      updateData.description = description;
    }

    // Handle file upload if avatar is provided
    if (req.file) {
      updateData.avatar = req.file.filename;
    }

    const provider = await User.findByIdAndUpdate(
      req.user.id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    if (!provider) {
      return res.status(404).json({ message: 'Provider not found' });
    }

    res.json({
      success: true,
      message: 'Profile updated successfully',
      provider
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllProviders,
  getProviderProfile,
  updateProviderProfile
};
