const asyncHandler = require('../middleware/async');
const Brand = require('../models/Brand');
const ErrorResponse = require('../utils/errorResponse');

exports.filterBrandSection = (s, requestBody) => {
  return s.name
    .toLowerCase()
    .trim()
    .includes(requestBody.name.toLowerCase().trim());
};

// @desc   Get all brand
// @route   /api/v1/brand
// @access   Public
exports.getBrands = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc   create a single brand
// @route   /api/v1/brand
// @access   Public
exports.createBrand = asyncHandler(async (req, res, next) => {
  const brand = await Brand.create(req.body);
  console.log(brand);

  res.status(201).json({
    succeed: true,
    data: brand,
    id: brand._id,
  });
});

// @desc   fetch single brand
// @route   /api/v1/brand/:id
// @access   Public
exports.getBrand = asyncHandler(async (req, res, next) => {
  const brand = await Brand.findById(req.params.id).populate(['products']);

  if (!brand) {
    return next(
      new ErrorResponse(`Brand not found with id of ${req.params.id}`, 404)
    );
  }
  res.status(200).json({
    success: true,
    data: brand,
  });
});

// @desc   update single brand
// @route   /api/v1/brand/:id
// @access   Public
exports.updateBrand = asyncHandler(async (req, res, next) => {
  ///Name Checked in Brand
  const duplicateItem = await Brand.findOne({
    name: req.body.name,
  });

  const brand = await Brand.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  ///Duplicate Check while updating
  if (duplicateItem && duplicateItem.id !== req.params.id) {
    return next(
      new ErrorResponse(
        `The name ( ${duplicateItem.name}) used another Brand`,
        409
      )
    );
  }

  if (!brand) {
    return next(
      new ErrorResponse(`Brand not found with id of ${req.params.id}`, 404)
    );
  }
  res.status(200).json({
    success: true,
    data: brand,
  });
});
// @desc   Delete single brand
// @route   /api/v1/brand/:id
// @access   Public
exports.deleteBrand = asyncHandler(async (req, res, next) => {
  // const brand = await brand.findByIdAndDelete(req.params.id);
  const brand = await Brand.findById(req.params.id);
  if (!brand) {
    return next(
      new ErrorResponse(`Brand not found with id of ${req.params.id}`, 404)
    );
  }

  brand.remove();

  res.status(200).json({
    success: true,
    data: req.params.id,
  });
});
