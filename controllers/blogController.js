const asyncHandler = require("../middleware/async");
const Blog = require("../models/Blog");
const ErrorResponse = require("../utils/errorResponse");

exports.filterBlogSection = (s, requestBody) => {
  return s.name
    .toLowerCase()
    .trim()
    .includes(requestBody.name.toLowerCase().trim());
};

// @desc   Get all blog
// @route   /api/v1/blog
// @access   Public
exports.getBlogs = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc   create a single blog
// @route   /api/v1/blog
// @access   Public
exports.createBlog = asyncHandler(async (req, res, next) => {
  const blog = await Blog.create(req.body);
  console.log(blog);

  res.status(201).json({
    succeed: true,
    data: blog,
    id: blog._id,
  });
});

// @desc   fetch single blog
// @route   /api/v1/blog/:id
// @access   Public
exports.getBlog = asyncHandler(async (req, res, next) => {
  const blog = await Blog.findById(req.params.id).populate([
    "category",
    "tag",
    "keyword",
    "comments",
  ]);

  if (!blog) {
    return next(
      new ErrorResponse(`Blog not found with id of ${req.params.id}`, 404),
    );
  }
  res.status(200).json({
    success: true,
    data: blog,
  });
});

// @desc   update single blog
// @route   /api/v1/blog/:id
// @access   Public
exports.updateBlog = asyncHandler(async (req, res, next) => {
  ///Name Checked in Blog
  const duplicateItem = await Blog.findOne({
    name: req.body.name,
  });

  const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  ///Duplicate Check while updating
  if (duplicateItem && duplicateItem.id !== req.params.id) {
    return next(
      new ErrorResponse(
        `The name ( ${duplicateItem.name}) used another Blog`,
        409,
      ),
    );
  }

  if (!blog) {
    return next(
      new ErrorResponse(`Blog not found with id of ${req.params.id}`, 404),
    );
  }
  res.status(200).json({
    success: true,
    data: blog,
  });
});
// @desc   Delete single blog
// @route   /api/v1/blog/:id
// @access   Public
exports.deleteBlog = asyncHandler(async (req, res, next) => {
  // const blog = await blog.findByIdAndDelete(req.params.id);
  const blog = await Blog.findById(req.params.id);
  if (!blog) {
    return next(
      new ErrorResponse(`Blog not found with id of ${req.params.id}`, 404),
    );
  }

  blog.deleteOne();

  res.status(200).json({
    success: true,
    data: req.params.id,
  });
});
