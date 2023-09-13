const mongoose = require('mongoose');
const { default: slugify } = require('slugify');

const AttributeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      unique: true,
      required: [true, 'Please add atrribute name'],
    },
    values: [String],
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

AttributeSchema.virtual('attributes', {
  ref: 'products',
  localField: '_id',
  foreignField: 'attribute',
  justOne: false,
});

AttributeSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});
module.exports = mongoose.model('Attributes', AttributeSchema);
