const mongoose = require("mongoose");

const OrderDetailsSchema = new mongoose.Schema({
  total: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    required: true,
    enum: [
      'Pending',
      'Received',
      'Completed',
      'Cancelled'
    ],
  },
  customer: {
    type: mongoose.Schema.ObjectId,
    ref: 'Customers',
    required: true
  },
  order: {
    type: mongoose.Schema.ObjectId,
    ref: 'OrderItems',
    required: true
  },
  payment: {
    type: mongoose.Schema.ObjectId,
    ref: 'Payments',
    required: true
  },
  createdAt:{
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("OrderDetails", OrderDetailsSchema);
