const mongoose = require("mongoose");
const { default: slugify } = require("slugify");

const BlogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      unique: true,
      required: [true, "Please add title"],
    },
    slug: String,

    categoryId: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Categories",
      },
    ],
    subCategoryId: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Categories",
      },
    ],
    tags: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Tags",
      },
    ],
    details: {
      type: String,
      trim: true,
      unique: true,
      required: [true, "Please add details "],
    },
    keyword: [
      {
        type: String,
      },
    ],
    metaDescription: {
      type: String,
      trim: true,
      required: [true, "Please add metaDescription "],
    },
    metaTitle: {
      type: String,
      trim: true,
      required: [true, "Please add metaTitle "],
    },

    author: {
      type: mongoose.Schema.ObjectId,
      ref: "Users",
    },

    featuredImageUrl: {
      type: String,
      default: "no-image.jpg",
      required: true,
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
  },
);
BlogSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

module.exports = mongoose.model("Blogs", BlogSchema);
