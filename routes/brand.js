const express = require('express');
const {
  getBrands,
  createBrand,
  getBrand,
  updateBrand,
  deleteBrand,
  filterBrandSection,
} = require('../controllers/brandController');

const Brand = require('../models/Brand');

const advancedResults = require('../middleware/advancedResults');

const router = express.Router();

router
  .route('/')
  .post(advancedResults(Brand, ['products'], filterBrandSection), getBrands)
  .get(advancedResults(Brand), getBrands);

router.route('/new').post(createBrand);

router.route('/:id').get(getBrand).put(updateBrand).delete(deleteBrand);

module.exports = router;
