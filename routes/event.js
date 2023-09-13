const express = require('express');
const {
  getEvents,
  createEvent,
  getEvent,
  updateEvent,
  deleteEvent,
  filterEventSection,
} = require('../controllers/eventController');

const Event = require('../models/Events');

const advancedResults = require('../middleware/advancedResults');

const router = express.Router();

router
  .route('/')
  .post(advancedResults(Event, null, filterEventSection), getEvents)
  .get(advancedResults(Event), getEvents);

router.route('/new').post(createEvent);

router.route('/:id').get(getEvent).put(updateEvent).delete(deleteEvent);

module.exports = router;
