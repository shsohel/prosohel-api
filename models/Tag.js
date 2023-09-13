const mongoose = require('mongoose');
const { default: slugify } = require('slugify');

const TagSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      unique: true,
      required: [true, 'Please add tag name'],
    },
    slug: String,
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
    timestamps: true
  }
);
TagSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});
//Reverse Populate with virtual
// TagSchema.virtual('products', {
//   ref: 'Products',
//   localField: '_id',
//   foreignField: '_tag',
//   justOne: false,
// });
module.exports = mongoose.model('Tags', TagSchema);
