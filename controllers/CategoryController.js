const asyncHandler = require("../middleware/async");
const Category = require("../models/Category");
const ErrorResponse = require("../utils/errorResponse");

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
  const category = await Category.findById(req.params.id);

  if (!category) {
    return next(
      new ErrorResponse(`Category not found with id of ${req.params.id}`, 404),
    );
  }

  const allCategory = await Category.find();

  const jsonCategory = JSON.parse(JSON.stringify(category));
  const jsonAllCategory = JSON.parse(JSON.stringify(allCategory));
  const subCategory = jsonAllCategory.filter((c) => !c.isParent);

  const getSubCategory = (parentId) => {
    const sub = subCategory.filter(
      (subCat) => subCat.parentCategory === parentId,
    );
    return sub;
  };

  const finalCategory = {
    ...jsonCategory,
    subCategory: getSubCategory(jsonCategory.id),
  };

  res.status(200).json({
    success: true,
    data: finalCategory,
  });
});
// @desc   fetch Menu category
// @route   /api/v1/category/get-category-menu
// @access   Public
exports.getCategoryMenu = asyncHandler(async (req, res, next) => {
  const category = await Category.find();

  const jsonCategory = JSON.parse(JSON.stringify(category));
  const parentCategory = jsonCategory.filter((c) => c.isParent);
  const subCategory = jsonCategory.filter((c) => !c.isParent);

  const getSubCategory = (parentId) => {
    const sub = subCategory.filter(
      (subCat) => subCat.parentCategory === parentId,
    );
    return sub;
  };

  const menuCategory = parentCategory.map((c) => ({
    ...c,
    subCategory: getSubCategory(c.id),
  }));

  if (!category) {
    return next(new ErrorResponse(`The menu category is not found!!! `, 404));
  }
  res.status(200).json({
    success: true,
    data: menuCategory,
  });
});

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
        409,
      ),
    );
  }

  if (!category) {
    return next(
      new ErrorResponse(`Category not found with id of ${req.params.id}`, 404),
    );
  }
  res.status(200).json({
    success: true,
    data: category,
  });
});

// @desc   Delete single category
// @route   /api/v1/category/:id
// @access   Public
exports.deleteCategory = asyncHandler(async (req, res, next) => {
  // const category = await category.findByIdAndDelete(req.params.id);
  const category = await Category.findById(req.params.id);
  if (!category) {
    return next(
      new ErrorResponse(`Category not found with id of ${req.params.id}`, 404),
    );
  }

  category.deleteOne();

  res.status(200).json({
    success: true,
    data: req.params.id,
  });
});
