const mongoose = require('mongoose');
const { default: slugify } = require('slugify');

const BrandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      unique: [true, 'Brand must be unique'],
      required: [true, 'Please add brand name'],
    },
    slug: String,
    logoUrl: String,
    descriptions: String,

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

BrandSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});
///Reverse Populate with virtuals
BrandSchema.virtual('products', {
  ref: 'Products',
  localField: '_id',
  foreignField: 'brand',
  justOne: false,
});

module.exports = mongoose.model('Brands', BrandSchema);
