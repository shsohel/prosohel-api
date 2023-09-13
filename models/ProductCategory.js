const mongoose = require('mongoose');
const { default: slugify } = require('slugify');

const ProductCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add category name'],
      trim: true,
      unique: true,
    },
    slug: String,
    isActive: {
      type: Boolean,
      default: true,
    },
    description: {
      type: String,
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },
    subCategories: [mongoose.Schema.ObjectId],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
ProductCategorySchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

///Reverse Populate with virtuals
ProductCategorySchema.virtual('products', {
  ref: 'Products',
  localField: '_id',
  foreignField: 'productCategory',
  justOne: false,
});

///Reverse Populate with virtuals
ProductCategorySchema.virtual('productSubCategories', {
  ref: 'ProductSubCategories',
  localField: 'subCategories',
  foreignField: '_id',
  justOne: false,
});

//Reverse Populate with virtual
ProductCategorySchema.virtual('includeCategories', {
  ref: 'Coupons',
  localField: '_id',
  foreignField: 'applyOnCategories',
  justOne: false,
});

//Reverse Populate with virtual
ProductCategorySchema.virtual('excludeCategories', {
  ref: 'ProductCategories',
  localField: '_id',
  foreignField: 'excludeOnCategories',
  justOne: false,
});

module.exports = mongoose.model('ProductCategories', ProductCategorySchema);
