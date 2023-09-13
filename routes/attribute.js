const express = require('express');

const Attribute = require('../models/Attribute');

const advancedResults = require('../middleware/advancedResults');
const {
  getAttributes,
  createAttribute,
  getAttribute,
  updateAttribute,
  deleteAttribute,
  filterSection,
  getAttributeValues,
  newAttributeValue,
} = require('../controllers/attributeController');

const router = express.Router();

router
  .route('/')
  .post(advancedResults(Attribute, null, filterSection), getAttributes)
  .get(advancedResults(Attribute), getAttributes);

router.route('/new').post(createAttribute);
router.route('/:id/values').get(getAttributeValues).put(newAttributeValue);

router
  .route('/:id')
  .get(getAttribute)
  .put(updateAttribute)
  .delete(deleteAttribute);

module.exports = router;
