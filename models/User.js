const mongoose = require("mongoose");
const { default: slugify } = require("slugify");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      unique: true,
      required: [true, "Please add a  name"],
    },
    slug: String,
    email: {
      type: String,
      unique: true,
      required: [true, "Please add a  email"],
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "Please use a valid email",
      ],
    },

    role: {
      type: String,
      enum: ["user", "publisher", "admin", "customer", "teacher"],
      default: "user",
    },
    password: {
      type: String,
      required: [true, "Please add a password"],
      minLength: 6,
      select: false,
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,

    photoUrl: {
      type: String,
      required: true,
      default: "default-user.png",
    },

    isActive: {
      type: Boolean,
      default: false,
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// UserSchema.virtual('slug').get(function () {
//   return slugify(this.name, { lower: true });
// });

//Reverse Populate with virtual
UserSchema.virtual("customers", {
  ref: "Customers",
  localField: "_id",
  foreignField: "_userId",
  justOne: false,
});

UserSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

///Encrypt password using bcrypt
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

///SIgn Jwt and Return
UserSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};
///Generate and hash password token
UserSchema.methods.getResetPasswordToken = function () {
  ///Generate Token
  const resetToken = crypto.randomBytes(20).toString("hex");

  ///Hash Token and set resetPasswordToken field
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  ///Set Expires
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

///Math user entered password to hashed password in database
UserSchema.methods.mathPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("Users", UserSchema);
