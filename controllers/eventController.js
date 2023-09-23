const asyncHandler = require("../middleware/async");
const Event = require("../models/Events");
const ErrorResponse = require("../utils/errorResponse");

// @desc   Get all event
// @route   /api/v1/event
// @access   Public
exports.getEvents = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc   create a single event
// @route   /api/v1/event
// @access   Public
exports.createEvent = asyncHandler(async (req, res, next) => {
  const event = await Event.create(req.body);
  console.log(event);

  res.status(201).json({
    succeed: true,
    data: event,
    id: event._id,
  });
});

// @desc   fetch single event
// @route   /api/v1/event/:id
// @access   Public
exports.getEvent = asyncHandler(async (req, res, next) => {
  const event = await Event.findById(req.params.id);

  if (!event) {
    return next(
      new ErrorResponse(`Event not found with id of ${req.params.id}`, 404),
    );
  }
  res.status(200).json({
    success: true,
    data: event,
  });
});

// @desc   update single event
// @route   /api/v1/event/:id
// @access   Public
exports.updateEvent = asyncHandler(async (req, res, next) => {
  ///Name Checked in Event
  const duplicateItem = await Event.findOne({
    name: req.body.name,
  });

  const event = await Event.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  ///Duplicate Check while updating
  if (duplicateItem && duplicateItem.id !== req.params.id) {
    return next(
      new ErrorResponse(
        `The name ( ${duplicateItem.name}) used another Event`,
        409,
      ),
    );
  }

  if (!event) {
    return next(
      new ErrorResponse(`Event not found with id of ${req.params.id}`, 404),
    );
  }
  res.status(200).json({
    success: true,
    data: event,
  });
});
// @desc   Delete single event
// @route   /api/v1/event/:id
// @access   Public
exports.deleteEvent = asyncHandler(async (req, res, next) => {
  // const event = await event.findByIdAndDelete(req.params.id);
  const event = await Event.findById(req.params.id);
  if (!event) {
    return next(
      new ErrorResponse(`Event not found with id of ${req.params.id}`, 404),
    );
  }

  event.deleteOne();

  res.status(200).json({
    success: true,
    data: req.params.id,
  });
});
