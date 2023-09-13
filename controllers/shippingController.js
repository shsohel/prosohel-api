const asyncHandler = require('../middleware/async');
const Shipping = require('../models/Shipping');
const ErrorResponse = require('../utils/errorResponse');

exports.filterShippingSection = (s, requestBody) => {
  return s.name
    .toLowerCase()
    .trim()
    .includes(requestBody.name.toLowerCase().trim());
};

// @desc   Get all shipping
// @route   /api/v1/shipping
// @access   Public
exports.getShippings = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc   create a single shipping
// @route   /api/v1/shipping
// @access   Public
exports.createShipping = asyncHandler(async (req, res, next) => {
  const shipping = await Shipping.create(req.body);
  console.log(shipping);

  res.status(201).json({
    succeed: true,
    data: shipping,
    id: shipping._id,
  });
});

// @desc   fetch single shipping
// @route   /api/v1/shipping/:id
// @access   Public
exports.getShipping = asyncHandler(async (req, res, next) => {
  const shipping = await Shipping.findById(req.params.id);

  if (!shipping) {
    return next(
      new ErrorResponse(`Shipping not found with id of ${req.params.id}`, 404)
    );
  }
  res.status(200).json({
    success: true,
    data: shipping,
  });
});

// @desc   update single shipping
// @route   /api/v1/shipping/:id
// @access   Public
exports.updateShipping = asyncHandler(async (req, res, next) => {
  ///Name Checked in Shipping
  const duplicateItem = await Shipping.findOne({
    name: req.body.name,
  });

  const shipping = await Shipping.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  ///Duplicate Check while updating
  if (duplicateItem && duplicateItem.id !== req.params.id) {
    return next(
      new ErrorResponse(
        `The name ( ${duplicateItem.name}) used another Shipping`,
        409
      )
    );
  }

  if (!shipping) {
    return next(
      new ErrorResponse(`Shipping not found with id of ${req.params.id}`, 404)
    );
  }
  res.status(200).json({
    success: true,
    data: shipping,
  });
});
// @desc   Delete single shipping
// @route   /api/v1/shipping/:id
// @access   Public
exports.deleteShipping = asyncHandler(async (req, res, next) => {
  // const shipping = await shipping.findByIdAndDelete(req.params.id);
  const shipping = await Shipping.findById(req.params.id);
  if (!shipping) {
    return next(
      new ErrorResponse(`Shipping not found with id of ${req.params.id}`, 404)
    );
  }

  shipping.remove();

  res.status(200).json({
    success: true,
    data: req.params.id,
  });
});
