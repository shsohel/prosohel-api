const mongoose = require("mongoose");

const TexSchema = new mongoose.Schema({
  amount:{
    type: Number,
    required: true
  },
  customer: {
    type: mongoose.Schema.ObjectId,
    ref: 'Customers',
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

module.exports = mongoose.model("Texs", TexSchema);
