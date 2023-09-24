const asyncHandler = require("../middleware/async");
const Comment = require("../models/Comment");
const ErrorResponse = require("../utils/errorResponse");

exports.filterCommentSection = (s, requestBody) => {
  console.log(requestBody);
  return s.name
    .toLowerCase()
    .trim()
    .includes(requestBody.name.toLowerCase().trim());
};

// @desc   Get all comment
// @route   /api/v1/comment
// @access   Public
exports.getCategories = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc   create a single comment
// @route   /api/v1/comment
// @access   Public
exports.createComment = asyncHandler(async (req, res, next) => {
  const comment = await Comment.create(req.body);
  res.status(201).json({
    succeed: true,
    data: comment,
    id: comment._id,
  });
});

// @desc   fetch single comment
// @route   /api/v1/comment/:id
// @access   Public
exports.getComment = asyncHandler(async (req, res, next) => {
  const comment = await Comment.findById(req.params.id).populate("user");

  if (!comment) {
    return next(
      new ErrorResponse(`Comment not found with id of ${req.params.id}`, 404),
    );
  }

  const allComment = await Comment.find();

  const jsonComment = JSON.parse(JSON.stringify(comment));
  const jsonAllComment = JSON.parse(JSON.stringify(allComment));
  const subComment = jsonAllComment.filter((c) => !c.isParent);

  const getSubComment = (parentId) => {
    const sub = subComment.filter(
      (subCat) => subCat.parentComment === parentId,
    );
    return sub;
  };

  const finalComment = {
    ...jsonComment,
    replay: getSubComment(jsonComment.id),
  };

  res.status(200).json({
    success: true,
    data: finalComment,
  });
});
// @desc   fetch Menu comment
// @route   /api/v1/comment/get-comment-menu
// @access   Public
exports.getCommentWithReplay = asyncHandler(async (req, res, next) => {
  const comment = await Comment.find().populate("user");

  const jsonComment = JSON.parse(JSON.stringify(comment));
  const parentComment = jsonComment.filter((c) => c.isParent);
  const subComment = jsonComment.filter((c) => !c.isParent);

  const getSubComment = (parentId) => {
    const sub = subComment.filter(
      (subCat) => subCat.parentComment === parentId,
    );
    return sub;
  };

  const menuComment = parentComment.map((c) => ({
    ...c,
    replay: getSubComment(c.id),
  }));

  if (!comment) {
    return next(new ErrorResponse(`The menu comment is not found!!! `, 404));
  }
  res.status(200).json({
    success: true,
    data: menuComment,
  });
});

// @desc   update single comment
// @route   /api/v1/comment/:id
// @access   Public
exports.updateComment = asyncHandler(async (req, res, next) => {
  ///Name Checked in Comment
  const duplicateItem = await Comment.findOne({
    name: req.body.name,
  });

  const comment = await Comment.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  ///Duplicate Check while updating
  if (duplicateItem && duplicateItem.id !== req.params.id) {
    return next(
      new ErrorResponse(
        `The name ( ${duplicateItem.name}) used another Comment`,
        409,
      ),
    );
  }

  if (!comment) {
    return next(
      new ErrorResponse(`Comment not found with id of ${req.params.id}`, 404),
    );
  }
  res.status(200).json({
    success: true,
    data: comment,
  });
});

// @desc   Delete single comment
// @route   /api/v1/comment/:id
// @access   Public
exports.deleteComment = asyncHandler(async (req, res, next) => {
  // const comment = await comment.findByIdAndDelete(req.params.id);
  const comment = await Comment.findById(req.params.id);
  if (!comment) {
    return next(
      new ErrorResponse(`Comment not found with id of ${req.params.id}`, 404),
    );
  }

  comment.deleteOne();

  res.status(200).json({
    success: true,
    data: req.params.id,
  });
});
