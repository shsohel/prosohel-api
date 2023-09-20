const mongoose = require("mongoose");
const { default: slugify } = require("slugify");

const CategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      unique: true,
      required: [true, "Please add category name"],
    },
    slug: String,

    isParent: {
      type: Boolean,
      default: true,
    },
    parentCategoryId: [mongoose.Schema.ObjectId],
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
  },
);
CategorySchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

module.exports = mongoose.model("Categories", CategorySchema);
