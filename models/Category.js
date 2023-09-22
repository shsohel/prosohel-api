const mongoose = require('mongoose');
const { default: slugify } = require('slugify');

const CategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      unique: true,
      required: [true, 'Please add category name'],
    },
    slug: String,

    isParent: {
      type: Boolean,
      default: true,
    },
    parentCategoryId: {
      type: mongoose.Schema.ObjectId,
      ref: 'Categories',
    },
    isActive: {
      type: Boolean,
      default: true,
    },

    description: {
      type: String,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
  }
);
CategorySchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

CategorySchema.virtual('subCategories', {
  ref: 'Categories',
  localField: 'parentCategoryId',
  foreignField: '_id',
  justOne: true,
});

module.exports = mongoose.model('Categories', CategorySchema);
