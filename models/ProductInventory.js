const mongoose = require("mongoose");

const ProductInventorySchema = new mongoose.Schema({
  quanity: {
    type: Number,
    required: true
  },
  product: {
    type: mongoose.Schema.ObjectId,
    ref: 'Products',
    required: true
  },
  attribute: {
    type: mongoose.Schema.ObjectId,
    ref: 'Attributes',
    required: true
  },
  supplier: {
    type: mongoose.Schema.ObjectId,
    ref: 'Suppliers',
    required: true
  },
  createdAt:{
    type: Date,
    default: Date.now
  },
  updatedAt:{
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("ProductInventories", ProductInventorySchema);
