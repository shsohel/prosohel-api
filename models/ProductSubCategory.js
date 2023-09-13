const mongoose = require('mongoose');
const { default: slugify } = require('slugify');

const ProductSubCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: true,
      required: [true, 'Please add sub category name'],
    },
    description: {
      type: String,
    },
    slug: String,
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

ProductSubCategorySchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

///Reverse Populate with virtuals
ProductSubCategorySchema.virtual('products', {
  ref: 'Products',
  localField: '_id',
  foreignField: 'productSubCategory',
  justOne: false,
});

///Reverse Populate with virtuals
ProductSubCategorySchema.virtual('productCategories', {
  ref: 'ProductCategories',
  localField: '_id',
  foreignField: 'subCategories',
  justOne: false,
});

//Reverse Populate with virtual
ProductSubCategorySchema.virtual('includeSubCategories', {
  ref: 'ProductSubCategories',
  localField: '_id',
  foreignField: 'applyOnSubCategories',
  justOne: false,
});
//Reverse Populate with virtual
ProductSubCategorySchema.virtual('excludeSubCategories', {
  ref: 'ProductSubCategories',
  localField: '_id',
  foreignField: 'excludeOnSubCategories',
  justOne: false,
});

module.exports = mongoose.model(
  'ProductSubCategories',
  ProductSubCategorySchema
);
