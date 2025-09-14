const User = require('../models/User');
const Equipment = require('../models/Equipment');
const Booking = require('../models/Booking');
const Category = require('../models/Category');

// @desc    Get dashboard statistics
// @route   GET /api/admin/dashboard
// @access  Private/Admin
const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalEquipment = await Equipment.countDocuments();
    const totalBookings = await Booking.countDocuments();
    const totalCategories = await Category.countDocuments();

    const pendingBookings = await Booking.countDocuments({ status: 'pending' });
    const confirmedBookings = await Booking.countDocuments({ status: 'confirmed' });
    const completedBookings = await Booking.countDocuments({ status: 'completed' });

    const recentBookings = await Booking.find({})
      .populate('user', 'name email')
      .populate('equipment', 'name')
      .sort({ createdAt: -1 })
      .limit(5);

    const monthlyRevenue = await Booking.aggregate([
      {
        $match: {
          status: 'completed',
          createdAt: {
            $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
          }
        }
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$totalPrice' }
        }
      }
    ]);

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalEquipment,
        totalBookings,
        totalCategories,
        pendingBookings,
        confirmedBookings,
        completedBookings,
        recentBookings,
        monthlyRevenue: monthlyRevenue[0]?.totalRevenue || 0
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all bookings for admin
// @route   GET /api/admin/bookings
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

// @desc    Manage equipment (update availability, etc.)
// @route   PUT /api/admin/equipment/:id
// @access  Private/Admin
const manageEquipment = async (req, res) => {
  try {
    const equipment = await Equipment.findById(req.params.id);

    if (!equipment) {
      return res.status(404).json({ message: 'Equipment not found' });
    }

    Object.keys(req.body).forEach(key => {
      equipment[key] = req.body[key];
    });

    await equipment.save();

    res.json({
      success: true,
      equipment
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Manage users (update role, status, etc.)
// @route   PUT /api/admin/users/:id
// @access  Private/Admin
const manageUsers = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    Object.keys(req.body).forEach(key => {
      user[key] = req.body[key];
    });

    await user.save();

    res.json({
      success: true,
      user
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getDashboardStats,
  getAllBookings,
  manageEquipment,
  manageUsers
};
