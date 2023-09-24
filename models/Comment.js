const mongoose = require("mongoose");
const { default: slugify } = require("slugify");

const CommentSchema = new mongoose.Schema(
  {
    details: {
      type: String,
      trim: true,
      unique: true,
      required: [true, "Please add a comment"],
    },

    isParent: {
      type: Boolean,
      default: true,
    },

    parentComment: {
      type: mongoose.Schema.ObjectId,
      ref: "Comments",
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "Users",
    },
    blog: {
      type: mongoose.Schema.ObjectId,
      ref: "Blogs",
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    isApproved: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
  },
);

///Reverse Populate with virtuals
CommentSchema.virtual("users", {
  ref: "Users",
  localField: "user",
  foreignField: "_id",
  justOne: false,
});
///Reverse Populate with virtuals
CommentSchema.virtual("blogs", {
  ref: "Blogs",
  localField: "blog",
  foreignField: "_id",
  justOne: false,
});
module.exports = mongoose.model("Comments", CommentSchema);
