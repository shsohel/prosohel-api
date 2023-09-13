const express = require('express');
const {
  getProductSubCategories,
  updateProductSubCategory,
  deleteProductSubCategory,
  getProductSubCategory,
  createProductSubCategory,
  getProductSubCategoriesByCategoryIds,
} = require('../controllers/productSubCategoryController');

const ProductSubCategory = require('../models/ProductSubCategory');

const advancedResults = require('../middleware/advancedResults');

const router = express.Router();

router
  .route('/')
  .post(
    advancedResults(ProductSubCategory, ['productCategories', 'products']),
    getProductSubCategories
  );

router.route('/new').post(createProductSubCategory);

router
  .route('/:id')
  .get(getProductSubCategory)
  .put(updateProductSubCategory)
  .delete(deleteProductSubCategory);

router
  .route('/get-sub-category-by-categoryIds')
  .post(getProductSubCategoriesByCategoryIds);
module.exports = router;
