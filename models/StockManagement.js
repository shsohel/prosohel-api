const mongoose = require('mongoose');

const StockManagementSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Products',
  },

  stockQuantity: {
    type: Number,
    required: [true, 'Please add Stock Quantity price'],
    min: 1,
  },

  stockMinQuantity: {
    type: Number,
    min: [10, 'Your product quantity must be greater than 10'],
  },

  lifeTimeTotalQuantity: {
    type: Number,
    default: 0,
  },

  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('StockManagements', StockManagementSchema);
