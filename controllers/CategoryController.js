const asyncHandler = require('../middleware/async');
const Category = require('../models/Category');
const ErrorResponse = require('../utils/errorResponse');

exports.filterCategorySection = (s, requestBody) => {
  console.log(requestBody);
  return s.name
    .toLowerCase()
    .trim()
    .includes(requestBody.name.toLowerCase().trim());
};

// @desc   Get all category
// @route   /api/v1/category
// @access   Public
exports.getCategories = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc   create a single category
// @route   /api/v1/category
// @access   Public
exports.createCategory = asyncHandler(async (req, res, next) => {
  const category = await Category.create(req.body);
  console.log(category);

  res.status(201).json({
    succeed: true,
    data: category,
    id: category._id,
  });
});

// @desc   fetch single category
// @route   /api/v1/category/:id
// @access   Public
exports.getCategory = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.params.id).populate([
    'blogs',
    'subCategories',
  ]);

  if (!category) {
    return next(
      new ErrorResponse(`Category not found with id of ${req.params.id}`, 404)
    );
  }
  res.status(200).json({
    success: true,
    data: category,
  });
});
// @desc   fetch single category
// @route   /api/v1/category/:id
// @access   Public
exports.getCategoryMenu = asyncHandler(async (req, res, next) => {
  const category = await Category.find().populate['subCategories'];

  if (!category) {
    return next(new ErrorResponse(`Category not found with id of `, 404));
  }
  res.status(200).json({
    success: true,
    data: category,
  });
});

// exports.getProductSubCategoryByCategoryId = asyncHandler(
//   async (req, res, next) => {
//     const category = await Category.findById(req.params.id).populate([
//       'productSubCategories',
//     ]);

//     if (!category) {
//       return next(
//         new ErrorResponse(
//           `Category not found with id of ${req.params.id}`,
//           404
//         )
//       );
//     }

//     const productSubCategory = category?.productSubCategories ?? [];

//     res.status(200).json({
//       success: true,
//       data: productSubCategory,
//     });
//   }
// );

// @desc   update single category
// @route   /api/v1/category/:id
// @access   Public
exports.updateCategory = asyncHandler(async (req, res, next) => {
  ///Name Checked in Category
  const duplicateItem = await Category.findOne({
    name: req.body.name,
  });

  const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  ///Duplicate Check while updating
  if (duplicateItem && duplicateItem.id !== req.params.id) {
    return next(
      new ErrorResponse(
        `The name ( ${duplicateItem.name}) used another Category`,
        409
      )
    );
  }

  if (!category) {
    return next(
      new ErrorResponse(`Category not found with id of ${req.params.id}`, 404)
    );
  }
  res.status(200).json({
    success: true,
    data: category,
  });
});

// @desc   insert product sub category
// @route   /api/v1/category/:id/sub-category
// @access   Public
// exports.newProductSubCategory = asyncHandler(async (req, res, next) => {
//   const submittedSubCategory = {
//     name: req.body.subCategory,
//     descriptions: req.body.subCategory,
//   };
//   const productSubCategory = await ProductSubCategory.create(
//     submittedSubCategory
//   );

//   const category = await Category.findById(req.params.id);

//   if (!category) {
//     return next(
//       new ErrorResponse(
//         `Category not found with id of ${req.params.id}`,
//         404
//       )
//     );
//   }
//   const productSubCategories = category.subCategories ?? [];

//   const updateProductSubCategories = [
//     ...productSubCategories,
//     productSubCategory.id,
//   ];

//   const updatedBody = {
//     subCategories: updateProductSubCategories,
//   };

//   await Category.findByIdAndUpdate(req.params.id, updatedBody, {
//     new: true,
//     runValidators: true,
//   });

//   res.status(200).json({
//     success: true,
//     data: productSubCategory,
//   });
// });

// @desc   Delete single category
// @route   /api/v1/category/:id
// @access   Public
exports.deleteCategory = asyncHandler(async (req, res, next) => {
  // const category = await category.findByIdAndDelete(req.params.id);
  const category = await Category.findById(req.params.id);
  if (!category) {
    return next(
      new ErrorResponse(`Category not found with id of ${req.params.id}`, 404)
    );
  }

  category.deleteOne();

  res.status(200).json({
    success: true,
    data: req.params.id,
  });
});
