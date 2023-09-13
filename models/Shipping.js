const mongoose = require('mongoose');

const rateCondition = new mongoose.Schema(
  {
    conditionBased: {
      type: String,
      trim: true,
      enum: ['quantity', 'weight', 'price'],
    },

    minQty: {
      type: Number,
      min: 0,
    },
    maxQty: {
      type: Number,
      min: 0,
    },

    minWeight: {
      type: Number,
      min: 0,
    },
    maxWeight: {
      type: Number,
      min: 0,
    },
    minPrice: {
      type: Number,
      min: 0,
    },

    maxPrice: {
      type: Number,
      min: 0,
    },
  },
  { _id: false }
);
const classCost = new mongoose.Schema(
  {
    shippingClassId: {
      type: mongoose.Schema.ObjectId,
    },
    shippingClassName: {
      type: String,
      trim: true,
    },
  },
  { _id: false }
);

const ShippingSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      unique: true,
      required: [true, 'Please add zone name'],
    },
    zoneRegions: {
      type: String,
      trim: true,
      required: [true, 'Please select a region'],
    },
    zone: {
      type: String,
      trim: true,
      required: [true, 'Please select a zone'],
    },
    postalCode: {
      type: String,
      trim: true,
      required: [true, 'Please add postal code'],
    },

    shippingMethod: {
      type: String,
      trim: true,
      required: [true, 'Please select a method'],
    },

    cost: {
      type: Number,
      required: true,
      min: 0,
    },

    conditions: [rateCondition],

    classCosting: [classCost],

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

module.exports = mongoose.model('Shippings', ShippingSchema);
