const asyncHandler = require('../middleware/async');
const Bootcamp = require('../models/Bootcamps');
const Course = require('../models/Course');
const ErrorResponse = require('../utils/errorResponse');

// @desc   Get all Course
// @route   /api/v1/courses
// @route   /api/v1/bootcamps/:bootcampId/courses
// @access   Public

exports.getCourses = asyncHandler(async (req, res, next) => {
  if (req.params.bootcampId) {
    const courses = Course.find({
      bootcamp: req.params.bootcampId,
    });
    const total = await Course.countDocuments();
    res.status(200).json({
      success: true,
      count: courses.length,
      totalRecords: total,
      data: courses,
    });
  } else {
    res.status(200).json(res.advancedResults);
  }
});

// @desc   Get Single Course
// @route   /api/v1/courses
// @access   Public

exports.getCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id);

  if (!course) {
    return next(
      new ErrorResponse(`No Course with id of ${req.params.id}`),
      404
    );
  }

  res.status(200).json({
    success: true,
    data: course,
  });
});
// @desc   Add Course
// @route   /api/v1/bootcamp/:bootcampId/courses
// @access   Public

exports.addCourse = asyncHandler(async (req, res, next) => {
  req.body.bootcamp = req.params.bootcampId;
  const bootcamp = await Bootcamp.findById(req.params.bootcampId);

  if (!bootcamp) {
    return next(
      new ErrorResponse(`No Bootcamp with id of ${req.params.bootcampId}`),
      404
    );
  }

  const course = await Course.create(req.body);

  res.status(200).json({
    success: true,
    data: course,
  });
});

// @desc   Update Course
// @route   /api/v1/courses/:id
// @access   Public

exports.updateCourse = asyncHandler(async (req, res, next) => {
  let course = await Course.findById(req.params.id);

  if (!course) {
    return next(
      new ErrorResponse(`No course with id of ${req.params.id}`),
      404
    );
  }

  course = await Course.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: course,
  });
});

// @desc     Delete Course
// @route   /api/v1/courses/:id
// @access   Public

exports.deleteCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id);
  console.log(req.params.id.red);

  if (!course) {
    return next(
      new ErrorResponse(`No course with id of ${req.params.id}`),
      404
    );
  }

  await course.remove();

  res.status(200).json({
    success: true,
    message: `The (${course.title}) has been deleted successfully`,
    data: {},
  });
});
