const asyncHandler = require("../middleware/async");
const Keyword = require("../models/Keyword");
const ErrorResponse = require("../utils/errorResponse");

exports.filterKeywordSection = (s, requestBody) => {
  return s.name
    .toLowerCase()
    .trim()
    .includes(requestBody.name.toLowerCase().trim());
};

// @desc   Get all keyword
// @route   /api/v1/keyword
// @access   Public
exports.getKeywords = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc   create a single keyword
// @route   /api/v1/keyword
// @access   Public
exports.createKeyword = asyncHandler(async (req, res, next) => {
  const keyword = await Keyword.create(req.body);
  console.log(keyword);

  res.status(201).json({
    succeed: true,
    data: keyword,
    id: keyword._id,
  });
});

// @desc   fetch single keyword
// @route   /api/v1/keyword/:id
// @access   Public
exports.getKeyword = asyncHandler(async (req, res, next) => {
  const keyword = await Keyword.findById(req.params.id);

  if (!keyword) {
    return next(
      new ErrorResponse(`Keyword not found with id of ${req.params.id}`, 404),
    );
  }
  res.status(200).json({
    success: true,
    data: keyword,
  });
});

// @desc   update single keyword
// @route   /api/v1/keyword/:id
// @access   Public
exports.updateKeyword = asyncHandler(async (req, res, next) => {
  ///Name Checked in Keyword
  const duplicateItem = await Keyword.findOne({
    name: req.body.name,
  });

  const keyword = await Keyword.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  ///Duplicate Check while updating
  if (duplicateItem && duplicateItem.id !== req.params.id) {
    return next(
      new ErrorResponse(
        `The name ( ${duplicateItem.name}) used another Keyword`,
        409,
      ),
    );
  }

  if (!keyword) {
    return next(
      new ErrorResponse(`Keyword not found with id of ${req.params.id}`, 404),
    );
  }
  res.status(200).json({
    success: true,
    data: keyword,
  });
});
// @desc   Delete single keyword
// @route   /api/v1/keyword/:id
// @access   Public
exports.deleteKeyword = asyncHandler(async (req, res, next) => {
  // const keyword = await keyword.findByIdAndDelete(req.params.id);
  const keyword = await Keyword.findById(req.params.id);
  if (!keyword) {
    return next(
      new ErrorResponse(`Keyword not found with id of ${req.params.id}`, 404),
    );
  }

  keyword.deleteOne();

  res.status(200).json({
    success: true,
    data: req.params.id,
  });
});
