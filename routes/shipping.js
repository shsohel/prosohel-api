const express = require('express');
const {
  getShippings,
  createShipping,
  getShipping,
  updateShipping,
  deleteShipping,
  filterShippingSection,
} = require('../controllers/shippingController');

const Shipping = require('../models/Shipping');

const advancedResults = require('../middleware/advancedResults');

const router = express.Router();

router
  .route('/')
  .post(advancedResults(Shipping, null, filterShippingSection), getShippings)
  .get(advancedResults(Shipping), getShippings);

router.route('/new').post(createShipping);

router
  .route('/:id')
  .get(getShipping)
  .put(updateShipping)
  .delete(deleteShipping);

module.exports = router;
