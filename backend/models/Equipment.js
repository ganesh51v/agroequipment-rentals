const mongoose = require('mongoose');

const EquipmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add equipment name'],
    trim: true,
    maxlength: [100, 'Equipment name cannot be more than 100 characters']
  },
  description: {
    type: String,
    maxlength: [1000, 'Description cannot be more than 1000 characters']
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  subcategory: {
    type: String,
    required: [true, 'Please add subcategory']
  },
  price: {
    type: Number,
    required: [true, 'Please add price'],
    min: [0, 'Price must be a positive number']
  },
  priceType: {
    type: String,
    enum: ['hourly', 'daily', 'weekly'],
    default: 'hourly'
  },
  images: [{
    type: String,
    default: 'no-image.jpg'
  }],
  specifications: {
    type: Map,
    of: String
  },
  availability: {
    type: Boolean,
    default: true
  },
  location: {
    type: String,
    required: [true, 'Please add location']
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Equipment', EquipmentSchema);
