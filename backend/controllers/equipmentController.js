
const Equipment = require('../models/Equipment');

// @desc    Get all equipment
// @route   GET /api/equipment
// @access  Public
const getAllEquipment = async (req, res) => {
  try {
    const { category, search, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const query = {};

    if (category) {
      query.category = category;
    }

    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    const total = await Equipment.countDocuments(query);
    const equipment = await Equipment.find(query)
      .skip(offset)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 })
      .lean();

    res.json({
      success: true,
      count: equipment.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      equipment
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single equipment
// @route   GET /api/equipment/:id
// @access  Public
const getEquipmentById = async (req, res) => {
  try {
    const connection = await mysql.connectMySQL();
    const [rows] = await connection.execute(
      `SELECT e.id, e.name, e.description, e.price_per_day AS price, e.images, c.name AS category_name
       FROM equipment e
       LEFT JOIN categories c ON e.category_id = c.id
       WHERE e.id = ?`,
      [req.params.id]
    );
    await connection.end();

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Equipment not found' });
    }

    res.json({
      success: true,
      equipment: rows[0]
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create equipment
// @route   POST /api/equipment
// @access  Private/Admin
const createEquipment = async (req, res) => {
  try {
    const {
      name,
      description,
      category,
      pricePerDay,
      pricePerHour,
      availability,
      specifications,
      location
    } = req.body;

    const connection = await require('../config/mysql').connectMySQL();

    const images = req.files ? JSON.stringify(req.files.map(file => file.filename)) : JSON.stringify([]);

    const [result] = await connection.execute(
      `INSERT INTO equipment (name, description, category_id, price_per_day, price_per_hour, availability, specifications, location, images)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, description, category, pricePerDay, pricePerHour, availability, JSON.stringify(specifications), location, images]
    );

    await connection.end();

    res.status(201).json({
      success: true,
      equipment: { id: result.insertId, name, description, category, pricePerDay, pricePerHour, availability, specifications, location, images }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update equipment
// @route   PUT /api/equipment/:id
// @access  Private/Admin
const updateEquipment = async (req, res) => {
  try {
    const connection = await require('../config/mysql').connectMySQL();

    const {
      name,
      description,
      category,
      pricePerDay,
      pricePerHour,
      availability,
      specifications,
      location,
      images
    } = req.body;

    const [result] = await connection.execute(
      `UPDATE equipment SET name = ?, description = ?, category_id = ?, price_per_day = ?, price_per_hour = ?, availability = ?, specifications = ?, location = ?, images = ? WHERE id = ?`,
      [name, description, category, pricePerDay, pricePerHour, availability, JSON.stringify(specifications), location, JSON.stringify(images), req.params.id]
    );

    await connection.end();

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Equipment not found' });
    }

    res.json({
      success: true,
      equipment: { id: req.params.id, name, description, category, pricePerDay, pricePerHour, availability, specifications, location, images }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete equipment
// @route   DELETE /api/equipment/:id
// @access  Private/Admin
const deleteEquipment = async (req, res) => {
  try {
    const equipment = await Equipment.findById(req.params.id);

    if (!equipment) {
      return res.status(404).json({ message: 'Equipment not found' });
    }

    await equipment.remove();

    res.json({
      success: true,
      message: 'Equipment removed'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllEquipment,
  getEquipmentById,
  createEquipment,
  updateEquipment,
  deleteEquipment
};
