const express = require('express');

const Category = require('../models/Category');

const advancedResults = require('../middleware/advancedResults');
const {
  createCategory,
  filterCategorySection,
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory,
  getCategoryMenu,
} = require('../controllers/CategoryController');

const router = express.Router();

router
  .route('/')
  .post(advancedResults(Category, [], filterCategorySection), getCategories)
  .get(advancedResults(Category), getCategories);

router.route('/new').post(createCategory);
router.route('/get-category-menu').get(getCategoryMenu);

router
  .route('/:id')
  .get(getCategory)
  .put(updateCategory)
  .delete(deleteCategory);

module.exports = router;
