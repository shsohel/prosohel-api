const asyncHandler = require('../middleware/async');
const ProductSubCategory = require('../models/ProductSubCategory');
const ProductCategory = require('../models/ProductCategory');
const ErrorResponse = require('../utils/errorResponse');

// @desc   Get all productSubCatetory
// @route   /api/v1/productSubCategory
// @access   Public
exports.getProductSubCategories = asyncHandler(async (req, res, next) => {
  ///see the route
  res.status(200).json(res.advancedResults);
});

// @desc   create a single productSubCatetory
// @route   /api/v1/productSubCategory
// @access   Public
exports.createProductSubCategory = asyncHandler(async (req, res, next) => {
  const productSubCategory = await ProductSubCategory.create(req.body);

  res.status(201).json({
    succeed: true,
    data: productSubCategory,
    id: productSubCategory._id,
  });
});

// @desc   fetch single productSubCatetory
// @route   /api/v1/productSubCategory/:id
// @access   Public
exports.getProductSubCategory = asyncHandler(async (req, res, next) => {
  const productSubCategory = await ProductSubCategory.findById(req.params.id);
  if (!productSubCategory) {
    return next(
      new ErrorResponse(
        `Product Sub Category not found with id of ${req.params.id}`,
        404
      )
    );
  }
  res.status(200).json({
    success: true,
    data: productSubCategory,
  });
});

// @desc   get Sub Categories by category Ids
// @route   /api/v1/productSubCategory/:id
// @access   Public
exports.getProductSubCategoriesByCategoryIds = asyncHandler(
  async (req, res, next) => {
    const { categoryIds } = req.body;

    if (!categoryIds) {
      return next(new ErrorResponse(`Please select Id categoryIds`, 404));
    }

    const productSubCategory = await ProductCategory.find().populate(
      'productSubCategories'
    );

    let category = [];

    if (categoryIds.length) {
      category = productSubCategory.filter((sub) =>
        categoryIds.some((c) => c === sub._id.toString())
      );
    }

    const subCategories = category
      .map((c) => c.productSubCategories)
      .flat()
      .map((sc) => ({ id: sc._id, name: sc.name }));

    res.status(200).json({
      success: true,
      data: subCategories,
    });
  }
);

// @desc   update single productSubCatetory
// @route   /api/v1/productSubCategory/:id
// @access   Public
exports.updateProductSubCategory = asyncHandler(async (req, res, next) => {
  ///Name Checked in Product Category
  const duplicateItem = await ProductSubCategory.findOne({
    name: req.body.name,
  });

  const productSubCategory = await ProductSubCategory.findByIdAndUpdate(
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
        `The name ( ${duplicateItem.name}) used another Product Sub Category`,
        409
      )
    );
  }

  if (!productSubCategory) {
    return next(
      new ErrorResponse(
        `Product Sub Category not found with id of ${req.params.id}`,
        404
      )
    );
  }
  res.status(200).json({
    success: true,
    data: productSubCategory,
  });
});
// @desc   Delete single productSubCatetory
// @route   /api/v1/productSubCategory/:id
// @access   Public
exports.deleteProductSubCategory = asyncHandler(async (req, res, next) => {
  // const productCatetory = await productCatetory.findByIdAndDelete(req.params.id);
  const productSubCatetory = await ProductSubCategory.findById(req.params.id);
  if (!productSubCatetory) {
    return next(
      new ErrorResponse(
        `Product Catetory not found with id of ${req.params.id}`,
        404
      )
    );
  }

  productSubCatetory.remove();

  res.status(200).json({
    success: true,
    data: req.params.id,
  });
});
