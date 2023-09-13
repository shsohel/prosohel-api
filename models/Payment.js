const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema({
  paymentType: {
    type: String,
    required: [true, "Please add payment type"]
  },
  provider: {
    type: String,
    required: false
  },
  accountNo: {
    type: String,
    required: [true, "Please add account number"]
  },
  expiry: {
    type: String,
    required: false
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

module.exports = mongoose.model("Payments", PaymentSchema);
