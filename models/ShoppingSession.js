const mongoose = require("mongoose");

const ShoppingSessionSchema = new mongoose.Schema({
  total: {
    type: Number,
    required: true
  },
  customer: {
    type: mongoose.Schema.ObjectId,
    ref: 'Customers',
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

module.exports = mongoose.model("ShoppingSessions", ShoppingSessionSchema);
