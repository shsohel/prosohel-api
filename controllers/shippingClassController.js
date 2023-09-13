const asyncHandler = require('../middleware/async');
const ShippingClass = require('../models/ShippingClass');
const ErrorResponse = require('../utils/errorResponse');

exports.filterShippingClassSection = (s, requestBody) => {
  return s.name
    .toLowerCase()
    .trim()
    .includes(requestBody.name.toLowerCase().trim());
};

// @desc   Get all shippingClass
// @route   /api/v1/shippingClass
// @access   Public
exports.getShippingClasses = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc   create a single shippingClass
// @route   /api/v1/shippingClass
// @access   Public
exports.createShippingClass = asyncHandler(async (req, res, next) => {
  const shippingClass = await ShippingClass.create(req.body);
  console.log(shippingClass);

  res.status(201).json({
    succeed: true,
    data: shippingClass,
    id: shippingClass._id,
  });
});

// @desc   fetch single shippingClass
// @route   /api/v1/shippingClass/:id
// @access   Public
exports.getShippingClass = asyncHandler(async (req, res, next) => {
  const shippingClass = await ShippingClass.findById(req.params.id);

  if (!shippingClass) {
    return next(
      new ErrorResponse(
        `ShippingClass not found with id of ${req.params.id}`,
        404
      )
    );
  }
  res.status(200).json({
    success: true,
    data: shippingClass,
  });
});

// @desc   update single shippingClass
// @route   /api/v1/shippingClass/:id
// @access   Public
exports.updateShippingClass = asyncHandler(async (req, res, next) => {
  ///Name Checked in ShippingClass
  const duplicateItem = await ShippingClass.findOne({
    name: req.body.name,
  });

  const shippingClass = await ShippingClass.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  ///Duplicate Check while updating
  if (duplicateItem && duplicateItem.id !== req.params.id) {
    return next(
      new ErrorResponse(
        `The name ( ${duplicateItem.name}) used another ShippingClass`,
        409
      )
    );
  }

  if (!shippingClass) {
    return next(
      new ErrorResponse(
        `ShippingClass not found with id of ${req.params.id}`,
        404
      )
    );
  }
  res.status(200).json({
    success: true,
    data: shippingClass,
  });
});
// @desc   Delete single shippingClass
// @route   /api/v1/shippingClass/:id
// @access   Public
exports.deleteShippingClass = asyncHandler(async (req, res, next) => {
  // const shippingClass = await shippingClass.findByIdAndDelete(req.params.id);
  const shippingClass = await ShippingClass.findById(req.params.id);
  if (!shippingClass) {
    return next(
      new ErrorResponse(
        `ShippingClass not found with id of ${req.params.id}`,
        404
      )
    );
  }

  shippingClass.remove();

  res.status(200).json({
    success: true,
    data: req.params.id,
  });
});
