const mongoose = require('mongoose');
// const { passwordValidator, emailValidator } = require('../utils/validate');

const CustomerSchema = new mongoose.Schema(
  {
    userId: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'Users',
      },
    ],
    slug: String,

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

CustomerSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

//Reverse Populate with virtual
CustomerSchema.virtual('users', {
  ref: 'Users',
  localField: 'userId',
  foreignField: '_id',
  justOne: false,
});

module.exports = mongoose.model('Customers', CustomerSchema);
