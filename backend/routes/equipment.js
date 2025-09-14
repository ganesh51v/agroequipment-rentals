const express = require('express');
const router = express.Router();
const {
  getAllEquipment,
  getEquipmentById,
  createEquipment,
  updateEquipment,
  deleteEquipment
} = require('../controllers/equipmentController');
const { protect, authorize } = require('../middleware/auth');

router.route('/')
  .get(getAllEquipment)
  .post(protect, authorize('admin', 'provider'), createEquipment);

router.route('/:id')
  .get(getEquipmentById)
  .put(protect, authorize('admin', 'provider'), updateEquipment)
  .delete(protect, authorize('admin', 'provider'), deleteEquipment);

module.exports = router;
