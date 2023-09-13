const mongoose = require('mongoose');

const AddressSchema = new mongoose.Schema({
  address_01: {
    type: String,
    required: [true, 'Please add your address'],
  },
  address_02: {
    type: String,
    required: false,
  }, 
  city: {
    type: String,
    required: [true, 'Please add your city'],
  },
  postCode: {
    type: String,
    required: false,
  },

  state: {
    type: String,
    required: [true, 'Please add your State or Disctrict'],
  },
  country: {
    type: String,
    required: false,
  },
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Users',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Addresses', AddressSchema);
