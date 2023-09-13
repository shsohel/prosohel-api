const asyncHandler = require('../middleware/async');
const Coupon = require('../models/Coupon');
const ErrorResponse = require('../utils/errorResponse');

exports.filterCouponSection = (s, requestBody) => {
  return s.name
    .toLowerCase()
    .trim()
    .includes(requestBody.name.toLowerCase().trim());
};

// @desc   Get all coupon
// @route   /api/v1/coupon
// @access   Public
exports.getCoupons = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc   create a single coupon
// @route   /api/v1/coupon
// @access   Public
exports.createCoupon = asyncHandler(async (req, res, next) => {
  const coupon = await Coupon.create(req.body);

  res.status(201).json({
    succeed: true,
    data: coupon,
    id: coupon._id,
  });
});

// @desc   fetch single coupon
// @route   /api/v1/coupon/:id
// @access   Public
exports.getCoupon = asyncHandler(async (req, res, next) => {
  const coupon = await Coupon.findById(req.params.id).populate([
    'includeProducts',
    'excludeProducts',
    'includeCategories',
    'excludeCategories',
    'includeSubCategories',
    'excludeSubCategories',
  ]);

  if (!coupon) {
    return next(
      new ErrorResponse(`Coupon not found with id of ${req.params.id}`, 404)
    );
  }
  res.status(200).json({
    success: true,
    data: coupon,
  });
});

// @desc   update single coupon
// @route   /api/v1/coupon/:id
// @access   Public
exports.updateCoupon = asyncHandler(async (req, res, next) => {
  ///Name Checked in Coupon
  const duplicateItem = await Coupon.findOne({
    name: req.body.name,
  });

  console.log(req.body);
  const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  ///Duplicate Check while updating
  if (duplicateItem && duplicateItem.id !== req.params.id) {
    return next(
      new ErrorResponse(
        `The name ( ${duplicateItem.name}) used another Coupon`,
        409
      )
    );
  }

  if (!coupon) {
    return next(
      new ErrorResponse(`Coupon not found with id of ${req.params.id}`, 404)
    );
  }
  res.status(200).json({
    success: true,
    data: coupon,
  });
});
// @desc   Delete single coupon
// @route   /api/v1/coupon/:id
// @access   Public
exports.deleteCoupon = asyncHandler(async (req, res, next) => {
  // const coupon = await coupon.findByIdAndDelete(req.params.id);
  const coupon = await Coupon.findById(req.params.id);
  if (!coupon) {
    return next(
      new ErrorResponse(`Coupon not found with id of ${req.params.id}`, 404)
    );
  }

  coupon.remove();

  res.status(200).json({
    success: true,
    data: req.params.id,
  });
});
