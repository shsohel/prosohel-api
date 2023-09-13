const mongoose = require('mongoose');
const { default: slugify } = require('slugify');

const TestSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      unique: true,
      required: [true, 'Please add product name'],
    },
    slug: String,

    sku: {
      type: String,
      trim: true,
      required: [true, 'Please add product sku'],
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

// ProductSchema.pre('save', function (next) {
//   this.slug = slugify(this.name, { lower: true });
//   next();
// });
// ProductSchema.virtual('slug').get(function() {
//   return slugify(this.name, { lower: true });
// });

module.exports = mongoose.model('Test', TestSchema);
