const express = require('express');
const {
  getShippingClasses,
  createShippingClass,
  getShippingClass,
  updateShippingClass,
  deleteShippingClass,
  filterShippingClassSection,
} = require('../controllers/shippingClassController');

const ShippingClass = require('../models/ShippingClass');

const advancedResults = require('../middleware/advancedResults');

const router = express.Router();

router
  .route('/')
  .post(
    advancedResults(ShippingClass, null, filterShippingClassSection),
    getShippingClasses
  )
  .get(advancedResults(ShippingClass), getShippingClasses);

router.route('/new').post(createShippingClass);

router
  .route('/:id')
  .get(getShippingClass)
  .put(updateShippingClass)
  .delete(deleteShippingClass);

module.exports = router;
