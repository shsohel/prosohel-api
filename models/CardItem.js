const mongoose = require("mongoose");

const CardItemSchema = new mongoose.Schema({
  quantity: {
    type: Number,
    required: true
  },
  session: {
    type: mongoose.Schema.ObjectId,
    ref: 'ShoppingSessions',
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
  },
  updatedAt:{
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("CardItems", CardItemSchema);
