const asyncHandler = require('../middleware/async');
const Attribute = require('../models/Attribute');
const ErrorResponse = require('../utils/errorResponse');

exports.filterSection = (s, requestBody) => {
  return s.name
    .toLowerCase()
    .trim()
    .includes(requestBody.name.toLowerCase().trim());
};

// @desc   Get all attribute
// @route   /api/v1/attribute
// @access   Public
exports.getAttributes = asyncHandler(async (req, res, next) => {
  ///see the route
  res.status(200).json(res.advancedResults);
});

// @desc   Get attribute values by attribute id
// @route   /api/v1/attribute/{id}
// @access   Public
exports.getAttributeValues = asyncHandler(async (req, res, next) => {
  ///see the route
  const attribute = await Attribute.findById(req.params.id);
  if (!attribute) {
    return next(
      new ErrorResponse(`Attribute not found with id of ${req.params.id}`, 404)
    );
  }
  const values = attribute.values;

  res.status(200).json({
    success: true,
    data: values,
    attributeId: attribute.id,
  });
});

// @desc   create a single attribute
// @route   /api/v1/attribute
// @access   Public
exports.createAttribute = asyncHandler(async (req, res, next) => {
  const attribute = await Attribute.create(req.body);
  res.status(201).json({
    succeed: true,
    data: attribute,
    id: attribute._id,
  });
});

// @desc   fetch single attribute
// @route   /api/v1/attribute/:id
// @access   Public
exports.getAttribute = asyncHandler(async (req, res, next) => {
  const attribute = await Attribute.findById(req.params.id);
  if (!attribute) {
    return next(
      new ErrorResponse(`Attribute not found with id of ${req.params.id}`, 404)
    );
  }
  res.status(200).json({
    success: true,
    data: attribute,
  });
});

// @desc   update single attribute
// @route   /api/v1/attribute/:id
// @access   Public
exports.updateAttribute = asyncHandler(async (req, res, next) => {
  ///Name Checked in Attribute
  const duplicateItem = await Attribute.findOne({
    name: req.body.name,
  });

  const attribute = await Attribute.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  ///Duplicate Check while updating
  if (duplicateItem && duplicateItem.id !== req.params.id) {
    return next(
      new ErrorResponse(
        `The name ( ${duplicateItem.name}) used another Attribute`,
        409
      )
    );
  }

  if (!attribute) {
    return next(
      new ErrorResponse(`Attribute not found with id of ${req.params.id}`, 404)
    );
  }
  res.status(200).json({
    success: true,
    data: attribute,
  });
});
// @desc   insert attribute value
// @route   /api/v1/attribute/:id/value
// @access   Public
exports.newAttributeValue = asyncHandler(async (req, res, next) => {
  const attribute = await Attribute.findById(req.params.id);

  // const attribute = await Attribute.findByIdAndUpdate(req.params.id, req.body, {
  //   new: true,
  //   runValidators: true,
  // });

  if (!attribute) {
    return next(
      new ErrorResponse(`Attribute not found with id of ${req.params.id}`, 404)
    );
  }

  const values = attribute.values;

  if (!req.body.value.length) {
    return next(new ErrorResponse(`Value is Empty`, 404));
  }

  const updateValues = [...values, req.body.value];
  const updatedBody = {
    values: updateValues,
  };
  const updatedAttribute = await Attribute.findByIdAndUpdate(
    req.params.id,
    updatedBody,
    {
      new: true,
      runValidators: true,
    }
  );
  res.status(200).json({
    success: true,
    data: updatedAttribute,
  });
});

// @desc   Delete single attribute
// @route   /api/v1/attribute/:id
// @access   Public
exports.deleteAttribute = asyncHandler(async (req, res, next) => {
  // const attribute = await attribute.findByIdAndDelete(req.params.id);
  const attribute = await Attribute.findById(req.params.id);
  console.log(req.params.id);
  if (!attribute) {
    return next(
      new ErrorResponse(`Attribute not found with id of ${req.params.id}`, 404)
    );
  }

  attribute.remove();

  res.status(200).json({
    success: true,
    data: req.params.id,
  });
});
