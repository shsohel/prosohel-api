const mongoose = require("mongoose");

const InvioceSchema = new mongoose.Schema({
  invoiceNumber: {
    type: String,
    required: true
  },
  customer: {
    type: mongoose.Schema.ObjectId,
    ref: 'Customers',
    required: true
  },
  orderDetails: {
    type: mongoose.Schema.ObjectId,
    ref: 'OrderDetails',
    required: true
  },
  paymentDetails: {
    type: mongoose.Schema.ObjectId,
    ref: 'PaymentDetails',
    required: true
  },
  product: {
    type: mongoose.Schema.ObjectId,
    ref: 'Products',
    required: true
  },
  address: {
    type: mongoose.Schema.ObjectId,
    ref: 'Addresses',
    required: true
  },
  createdAt:{
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Invioces", InvioceSchema);
