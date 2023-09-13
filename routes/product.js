const express = require('express');
const {
  getProducts,
  updateProduct,
  deleteProduct,
  getProduct,
  createProduct,
  getProductBySlug,
  getProductsFilter,
} = require('../controllers/productController');

const Product = require('../models/Product');

const advancedResults = require('../middleware/advancedResults');

const router = express.Router();

router
  .route('/')
  .post(
    advancedResults(Product, ['productCategories', 'productSubCategories']),
    getProducts
  )
  .get(advancedResults(Product), getProducts);

router.route('/products-filter').post(getProductsFilter);

router.route('/new').post(createProduct);

router.route('/:id').get(getProduct).put(updateProduct).delete(deleteProduct);
router.route('/slug/:slug').get(getProductBySlug);

module.exports = router;
