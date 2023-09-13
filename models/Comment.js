const mongoose = require("mongoose");
const { default: slugify } = require("slugify");

const CommentSchema = new mongoose.Schema(
  {
    description: {
      type: String,
      trim: true,
      unique: true,
      required: [true, "Please add description"],
    },

    blogId: mongoose.Schema.ObjectId,
    userId: mongoose.Schema.ObjectId,

    isActive: {
      type: Boolean,
      default: true,
    },

    isApproved: {
      type: Boolean,
      default: false,
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

CommentSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

module.exports = mongoose.model("Comments", CommentSchema);
