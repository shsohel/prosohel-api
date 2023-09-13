const mongoose = require("mongoose");

const ProductReviewSchema = new mongoose.Schema({
  comment: {
    type: String,
    required: false
  },
  review: {
    type: Number,
    required: false
  },
  product: {
    type: mongoose.Schema.ObjectId,
    ref: 'Products',
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

module.exports = mongoose.model("ProductReviews", ProductReviewSchema);
