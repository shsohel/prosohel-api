const asyncHandler = require('../middleware/async');
const ProductCategory = require('../models/ProductCategory');
const ProductSubCategory = require('../models/ProductSubCategory');
const ErrorResponse = require('../utils/errorResponse');

exports.filterProductCategorySection = (s, requestBody) => {
  console.log(requestBody);
  return s.name
    .toLowerCase()
    .trim()
    .includes(requestBody.name.toLowerCase().trim());
};

// @desc   Get all productCatetory
// @route   /api/v1/productCategory
// @access   Public
exports.getProductCategories = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc   create a single productCatetory
// @route   /api/v1/productCategory
// @access   Public
exports.createProductCategory = asyncHandler(async (req, res, next) => {
  const productCategory = await ProductCategory.create(req.body);
  console.log(productCategory);

  res.status(201).json({
    succeed: true,
    data: productCategory,
    id: productCategory._id,
  });
});

// @desc   fetch single productCatetory
// @route   /api/v1/productCategory/:id
// @access   Public
exports.getProductCategory = asyncHandler(async (req, res, next) => {
  const productCategory = await ProductCategory.findById(
    req.params.id
  ).populate(['products', 'productSubCategories']);

  if (!productCategory) {
    return next(
      new ErrorResponse(
        `Product Category not found with id of ${req.params.id}`,
        404
      )
    );
  }
  res.status(200).json({
    success: true,
    data: productCategory,
  });
});

exports.getProductSubCategoryByCategoryId = asyncHandler(
  async (req, res, next) => {
    const productCategory = await ProductCategory.findById(
      req.params.id
    ).populate(['productSubCategories']);

    if (!productCategory) {
      return next(
        new ErrorResponse(
          `Product Category not found with id of ${req.params.id}`,
          404
        )
      );
    }

    const productSubCategory = productCategory?.productSubCategories ?? [];

    res.status(200).json({
      success: true,
      data: productSubCategory,
    });
  }
);

// @desc   update single productCatetory
// @route   /api/v1/productCategory/:id
// @access   Public
exports.updateProductCategory = asyncHandler(async (req, res, next) => {
  ///Name Checked in Product Category
  const duplicateItem = await ProductCategory.findOne({
    name: req.body.name,
  });

  const productCategory = await ProductCategory.findByIdAndUpdate(
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
        `The name ( ${duplicateItem.name}) used another Product Category`,
        409
      )
    );
  }

  if (!productCategory) {
    return next(
      new ErrorResponse(
        `Product Category not found with id of ${req.params.id}`,
        404
      )
    );
  }
  res.status(200).json({
    success: true,
    data: productCategory,
  });
});

// @desc   insert product sub category
// @route   /api/v1/productCategory/:id/sub-category
// @access   Public
exports.newProductSubCategory = asyncHandler(async (req, res, next) => {
  const submittedSubCategory = {
    name: req.body.subCategory,
    descriptions: req.body.subCategory,
  };
  const productSubCategory = await ProductSubCategory.create(
    submittedSubCategory
  );

  const productCategory = await ProductCategory.findById(req.params.id);

  if (!productCategory) {
    return next(
      new ErrorResponse(
        `Product Category not found with id of ${req.params.id}`,
        404
      )
    );
  }
  const productSubCategories = productCategory.subCategories ?? [];

  const updateProductSubCategories = [
    ...productSubCategories,
    productSubCategory.id,
  ];

  const updatedBody = {
    subCategories: updateProductSubCategories,
  };

  await ProductCategory.findByIdAndUpdate(req.params.id, updatedBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: productSubCategory,
  });
});

// @desc   Delete single productCategory
// @route   /api/v1/productCategory/:id
// @access   Public
exports.deleteProductCategory = asyncHandler(async (req, res, next) => {
  // const productCatetory = await productCatetory.findByIdAndDelete(req.params.id);
  const productCatetory = await ProductCategory.findById(req.params.id);
  if (!productCatetory) {
    return next(
      new ErrorResponse(
        `Product Catetory not found with id of ${req.params.id}`,
        404
      )
    );
  }

  productCatetory.remove();

  res.status(200).json({
    success: true,
    data: req.params.id,
  });
});
