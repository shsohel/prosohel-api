const mongoose = require('mongoose');

const CouponSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, 'Please add discount name'],
    },

    discountType: {
      type: String,
      trim: true,
      required: [true, 'Please add discount type'],
    },

    amount: {
      type: Number,
      default: 0,
      required: [true, 'Please add discount amount'],
    },

    allowFreeShipping: {
      type: Boolean,
      default: false,
    },

    expiryDate: {
      type: Date,
      required: true,
    },

    minSpend: {
      type: Number,
      min: 0,
    },
    maxSpend: {
      type: Number,
      min: 10,
    },
    usageLimitPerCoupon: {
      type: Number,
      min: 0,
    },
    usageLimitPerUser: {
      type: Number,
      min: 0,
    },

    applyOnProducts: [mongoose.Schema.ObjectId],
    excludeOnProducts: [mongoose.Schema.ObjectId],

    applyOnCategories: [mongoose.Schema.ObjectId],
    excludeOnCategories: [mongoose.Schema.ObjectId],

    applyOnSubCategories: [mongoose.Schema.ObjectId],
    excludeOnSubCategories: [mongoose.Schema.ObjectId],

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

//Reverse Populate with virtual
CouponSchema.virtual('includeProducts', {
  ref: 'Products',
  localField: 'applyOnProducts',
  foreignField: '_id',
  justOne: false,
});

//Reverse Populate with virtual
CouponSchema.virtual('excludeProducts', {
  ref: 'Products',
  localField: 'excludeOnProducts',
  foreignField: '_id',
  justOne: false,
});

//Reverse Populate with virtual
CouponSchema.virtual('includeCategories', {
  ref: 'ProductCategories',
  localField: 'applyOnCategories',
  foreignField: '_id',
  justOne: false,
});
//Reverse Populate with virtual
CouponSchema.virtual('excludeCategories', {
  ref: 'ProductCategories',
  localField: 'excludeOnCategories',
  foreignField: '_id',
  justOne: false,
});
//Reverse Populate with virtual
CouponSchema.virtual('includeSubCategories', {
  ref: 'ProductSubCategories',
  localField: 'applyOnSubCategories',
  foreignField: '_id',
  justOne: false,
});
//Reverse Populate with virtual
CouponSchema.virtual('excludeSubCategories', {
  ref: 'ProductSubCategories',
  localField: 'excludeOnSubCategories',
  foreignField: '_id',
  justOne: false,
});

// //Reverse Populate with virtual
// CouponSchema.virtual('excludeOnCategories', {
//   ref: 'ProductCategories',
//   localField: 'excludeOnCategories',
//   foreignField: '_id',
//   justOne: false,
// });

// //Reverse Populate with virtual
// CouponSchema.virtual('applyOnSubCategories', {
//   ref: 'ProductSubCategories',
//   localField: 'applyOnSubCategories',
//   foreignField: '_id',
//   justOne: false,
// });
// //Reverse Populate with virtual
// CouponSchema.virtual('excludeOnSubCategories', {
//   ref: 'ProductSubCategories',
//   localField: 'excludeOnSubCategories',
//   foreignField: '_id',
//   justOne: false,
// });

module.exports = mongoose.model('Coupons', CouponSchema);

// Discount Type
// Coupon Amount
// Allow Free Shipping
// Coupon Expiry Date
// ---

// Minimum spend
// Maximum spend

// -----

// Products
// Exclude Produccts

// Product Categories

// Exclude Categories

// -----
// Usage Limit per coupon
// Usage Limit per user
