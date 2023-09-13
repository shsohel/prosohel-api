const mongoose = require("mongoose");

const PaymentDetailsSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: true
  },
  provider: {
    type: String,
    required: true
  },
  accountNo: {
    type: String,
    required: [true, "Please add account number"]
  },
  status: {
    type: String,
    required: ture,
    enum: [
      'Cash',
      'Card',
      'Bank',
      'Mobile_Banking'
    ],
  },
  payment: {
    type: mongoose.Schema.ObjectId,
    ref: 'Payments',
    required: true
  },
  orderDetails: {
    type: mongoose.Schema.ObjectId,
    ref: 'OrderDetails',
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

module.exports = mongoose.model("PaymentDetails", PaymentDetailsSchema);
