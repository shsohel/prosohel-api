const asyncHandler = require("../middleware/async");
const Tag = require("../models/Tag");
const ErrorResponse = require("../utils/errorResponse");

exports.filterTagSection = (s, requestBody) => {
  return s.name
    .toLowerCase()
    .trim()
    .includes(requestBody.name.toLowerCase().trim());
};

// @desc   Get all tag
// @route   /api/v1/tag
// @access   Public
exports.getTags = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc   create a single tag
// @route   /api/v1/tag
// @access   Public
exports.createTag = asyncHandler(async (req, res, next) => {
  const tag = await Tag.create(req.body);
  console.log(tag);

  res.status(201).json({
    succeed: true,
    data: tag,
    id: tag._id,
  });
});

// @desc   fetch single tag
// @route   /api/v1/tag/:id
// @access   Public
exports.getTag = asyncHandler(async (req, res, next) => {
  const tag = await Tag.findById(req.params.id);

  if (!tag) {
    return next(
      new ErrorResponse(`Tag not found with id of ${req.params.id}`, 404),
    );
  }
  res.status(200).json({
    success: true,
    data: tag,
  });
});

// @desc   update single tag
// @route   /api/v1/tag/:id
// @access   Public
exports.updateTag = asyncHandler(async (req, res, next) => {
  ///Name Checked in Tag
  const duplicateItem = await Tag.findOne({
    name: req.body.name,
  });

  const tag = await Tag.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  ///Duplicate Check while updating
  if (duplicateItem && duplicateItem.id !== req.params.id) {
    return next(
      new ErrorResponse(
        `The name ( ${duplicateItem.name}) used another Tag`,
        409,
      ),
    );
  }

  if (!tag) {
    return next(
      new ErrorResponse(`Tag not found with id of ${req.params.id}`, 404),
    );
  }
  res.status(200).json({
    success: true,
    data: tag,
  });
});
// @desc   Delete single tag
// @route   /api/v1/tag/:id
// @access   Public
exports.deleteTag = asyncHandler(async (req, res, next) => {
  // const tag = await tag.findByIdAndDelete(req.params.id);
  const tag = await Tag.findById(req.params.id);
  if (!tag) {
    return next(
      new ErrorResponse(`Tag not found with id of ${req.params.id}`, 404),
    );
  }

  tag.deleteOne();

  res.status(200).json({
    success: true,
    data: req.params.id,
  });
});
