const mongoose = require("mongoose");
const { default: slugify } = require("slugify");

const CommentReplySchema = new mongoose.Schema(
  {
    description: {
      type: String,
      trim: true,
      unique: true,
      required: [true, "Please add description"],
    },

    commentId: mongoose.Schema.ObjectId,
    userId: mongoose.Schema.ObjectId,

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

CommentReplySchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

module.exports = mongoose.model("CommentReplies", CommentReplySchema);
