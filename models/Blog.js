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

    category: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Categories",
      },
    ],
    tag: [
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
        type: mongoose.Schema.ObjectId,
        ref: "Keywords",
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
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
  },
);
BlogSchema.pre("save", function (next) {
  this.slug = slugify(this.title, { lower: true });
  next();
});

///Reverse Populate with virtuals
BlogSchema.virtual("categories", {
  ref: "Categories",
  localField: "category",
  foreignField: "_id",
  justOne: false,
});
///Reverse Populate with virtuals
BlogSchema.virtual("tags", {
  ref: "Tags",
  localField: "tag",
  foreignField: "_id",
  justOne: false,
});
///Reverse Populate with virtuals
BlogSchema.virtual("keywords", {
  ref: "Keywords",
  localField: "keyword",
  foreignField: "_id",
  justOne: false,
});

///Reverse Populate with virtuals
BlogSchema.virtual("comments", {
  ref: "Comments",
  localField: "_id",
  foreignField: "blog",
  justOne: false,
});

module.exports = mongoose.model("Blogs", BlogSchema);
