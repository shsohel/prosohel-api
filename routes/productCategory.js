const express = require('express');
const {
  getProductCategories,
  updateProductCategory,
  deleteProductCategory,
  getProductCategory,
  createProductCategory,
  filterProductCategorySection,
  getProductSubCategoryByCategoryId,
  newProductSubCategory,
} = require('../controllers/productCategoryController');

const ProductCategory = require('../models/ProductCategory');

const advancedResults = require('../middleware/advancedResults');

const router = express.Router();

router
  .route('/')
  .post(
    advancedResults(
      ProductCategory,
      ['products', 'productSubCategories'],
      filterProductCategorySection
    ),
    getProductCategories
  )
  .get(advancedResults(ProductCategory), getProductCategories);

router.route('/new').post(createProductCategory);
router
  .route('/:id/sub-category')
  .get(getProductSubCategoryByCategoryId)
  .put(newProductSubCategory);

router
  .route('/:id')
  .get(getProductCategory)
  .put(updateProductCategory)
  .delete(deleteProductCategory);

module.exports = router;
