const mongoose = require('mongoose');
const { default: slugify } = require('slugify');

const EventSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: [true, 'Please add Title '],
  },

  startDate: {
    type: String,
    trim: true,
    required: [true, 'Please add Start date '],
  },
  endDate: {
    type: String,
    trim: true,
    required: [true, 'Please add End date '],
  },

  subject: {
    type: String,
    trim: true,
    required: [true, 'Please add Subject '],
  },
  teacher: {
    type: String,
    trim: true,
    required: [true, 'Please add Teacher '],
  },

  descriptions: String,

  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Events', EventSchema);
