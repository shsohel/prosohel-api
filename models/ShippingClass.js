const mongoose = require('mongoose');

const ShippingClassSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      unique: [true, 'Class Name must be unique'],

      required: [true, 'Please add shipping class name'],
    },
    descriptions: {
      type: String,
      required: false,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

module.exports = mongoose.model('ShippingClasses', ShippingClassSchema);
