const mongoose = require("mongoose");

const OrderItemSchema = new mongoose.Schema({
  quantity: {
    type: Number,
    required: true
  },
  product: {
    type: mongoose.Schema.ObjectId,
    ref: 'Products',
    required: true
  },
  createdAt:{
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("OrderItems", OrderItemSchema);
