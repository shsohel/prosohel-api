const mongoose = require("mongoose");
const { emailValidator } = require("../utils/validate");

const SupplierSchema = new mongoose.Schema({
  name:{
    type: String,
    required: [true, "Please add supplier name"]
  },
  phone:{
    type: String,
    match: [/^(\()?\d{3}(\))?(-|\s)?\d{3}(-|\s)\d{4}$/, 'Please use a valid phone number'],
    trim: true,
  },
  email: {
    type: String,
    validate: emailValidator,
    unique: true,
    trim: true,
  },
  isActive:{
    type: Boolean,
    default: true
  },
  createdAt:{
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Suppliers", SupplierSchema);
