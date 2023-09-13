const mongoose = require("mongoose");
const { default: slugify } = require("slugify");

const KeywordSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      unique: true,
      required: [true, "Please add keyword name"],
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

module.exports = mongoose.model("Keywords", KeywordSchema);
