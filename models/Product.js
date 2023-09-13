const mongoose = require('mongoose');
const { default: slugify } = require('slugify');

const imgUrls = new mongoose.Schema(
  {
    url: {
      type: String,
      default: 'no-image.jpg',
      required: true,
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  { _id: false }
);
const attributes = new mongoose.Schema(
  {
    id: mongoose.Schema.ObjectId,
    values: [String],
  },
  { _id: false }
);

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      unique: [true, 'Product name must be unique'],
      required: [true, 'Please add product name'],
    },
    slug: String,

    sku: {
      type: String,
      trim: true,
      unique: [true, 'Product SKU must be unique'],
      required: [true, 'Please add product sku'],
    },
    price: {
      type: Number,
      required: [true, 'Please add product price'],
      min: 0.01,
    },
    salePrice: {
      type: Number,
      required: [true, 'Please add sale price'],
      min: 0.01,
    },

    images: [imgUrls],

    discount: {
      type: mongoose.Schema.ObjectId,
      ref: 'Discounts',
      required: false,
    },

    productCategory: {
      type: mongoose.Schema.ObjectId,
      ref: 'ProductCategories',
      required: true,
    },
    productSubCategory: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'ProductSubCategories',
      },
    ],
    brand: {
      type: mongoose.Schema.ObjectId,
      ref: 'Brands',
    },
    attribute: [attributes],

    weight: {
      type: Number,
      min: 0,
    },

    length: {
      type: Number,
      min: 0,
    },
    height: {
      type: Number,
      min: 0,
    },
    width: {
      type: Number,
      min: 0,
    },

    isEnableReview: {
      type: Boolean,
      default: true,
    },

    isStockMange: {
      type: Boolean,
      default: false,
    },

    stockQuantity: {
      type: Number,
      required: [false, 'Please add Stock Quantity price'],
      min: 0,
    },

    isProductStockAvailable: {
      type: Boolean,
      default: true,
    },

    descriptions: {
      type: String,
      required: false,
    },
    shotDescriptions: {
      type: String,
      required: false,
    },

    tag: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'Tags',
      },
    ],

    shippingCost: {
      type: Number,
      min: 0,
    },

    taxPercentage: {
      type: Number,
      min: 0,
    },

    isFeatureProduct: {
      type: Boolean,
      default: false,
    },

    status: {
      type: String,
      required: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

ProductSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// ProductSchema.virtual('slug').get(function () {
//   return slugify(this.name, { lower: true });
// });

// ///Reverse Populate with virtual
// ProductSchema.virtual('discounts', {
//   ref: 'Discounts',
//   localField: '_id',
//   foreignField: 'discount',
//   justOne: false,
// });

///Reverse Populate with virtual
ProductSchema.virtual('attributes', {
  ref: 'Attributes',
  localField: 'attribute',
  foreignField: '_id',
  justOne: false,
});

//Reverse Populate with virtual
ProductSchema.virtual('productCategories', {
  ref: 'ProductCategories',
  localField: 'productCategory',
  foreignField: '_id',
  justOne: false,
});
//Reverse Populate with virtual
ProductSchema.virtual('productSubCategories', {
  ref: 'ProductSubCategories',
  localField: 'productSubCategory',
  foreignField: '_id',
  justOne: false,
});
//Reverse Populate with virtual
ProductSchema.virtual('tags', {
  ref: 'Tags',
  localField: 'tag',
  foreignField: '_id',
  justOne: false,
});

//Reverse Populate with virtual
ProductSchema.virtual('brands', {
  ref: 'Brands',
  localField: 'brand',
  foreignField: '_id',
  justOne: false,
});

//Reverse Populate with virtual
ProductSchema.virtual('includeProducts', {
  ref: 'Products',
  localField: '_id',
  foreignField: 'applyOnProducts',
  justOne: false,
});

//Reverse Populate with virtual
ProductSchema.virtual('excludeProducts', {
  ref: 'Products',
  localField: '_id',
  foreignField: 'excludeOnProducts',
  justOne: false,
});

module.exports = mongoose.model('Products', ProductSchema);
