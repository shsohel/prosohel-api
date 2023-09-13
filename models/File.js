const mongoose = require('mongoose');

const FileSchema = new mongoose.Schema({
  fileUrl: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Files', FileSchema);
