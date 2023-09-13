const asyncHandler = require('../middleware/async');
const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');

const sendTokenResponse = (user, statusCode, res) => {
  const token = user.getSignedJwtToken();

  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    path: '/',
    // domain: 'http://localhost:3000',
  };

  console.log(options.expires);

  if (process.env.NODE_ENV === 'production') {
    options.secure = true;
  }

  res.status(statusCode).cookie('token', token, options).json({
    success: true,
    token,
  });
};
const emailSend = async (user, resetToken, clientUrl, res, next) => {
  const resetUrl = `${clientUrl}/auth/reset-password/${resetToken}`;

  const message = `You are receiving this email because you has requested the reset
  of a password, Please make a PUT request to: \n\n ${resetUrl}`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Confirmation Token token',
      message,
    });
    res.status(200).json({
      success: true,
      message: 'Email Send Successfully',
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    return next(new ErrorResponse('Email could not be sent', 500));
  }
};

// @desc   Create a user
// @route   /api/v1/auth/register
// @access   Public

exports.register = asyncHandler(async (req, res, next) => {
  const { name, email, password, role } = req.body;

  const exitingUser = await User.findOne({ email });
  if (exitingUser) {
    return next(new ErrorResponse('The e-mail address used previous!', 400));
  }

  ///Generate Token
  const resetToken = crypto.randomBytes(20).toString('hex');

  ///Hash Token and set resetPasswordToken field
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  ///Set Expires
  resetPasswordExpire = Date.now() + 10 * 60 * 1000;

  //Create a new user
  const user = await User.create({
    name,
    email,
    password,
    role,
    resetPasswordToken,
    resetPasswordExpire,
  });

  emailSend(user, resetToken, req.body.clientUrl, res, next);

  // const resetUrl = `${req.body.clientUrl}/auth/reset-password/${resetToken}`;

  // const message = `You are receiving this email because you has requested the reset
  // of a password, Please make a PUT request to: \n\n ${resetUrl}`;

  // try {
  //   await sendEmail({
  //     email: user.email,
  //     subject: 'Confirmation Token token',
  //     message,
  //   });
  //   res.status(200).json({
  //     success: true,
  //     message: 'Email Send Successfully',
  //   });
  // } catch (error) {
  //   user.resetPasswordToken = undefined;
  //   user.resetPasswordExpire = undefined;

  //   return next(new ErrorResponse('Email could not be sent', 500));
  // }

  // sendTokenResponse(user, 200, res);
});
// @desc   Create a user
// @route   /api/v1/auth/login
// @access   Public

exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(
      new ErrorResponse('Please provide a valid email and password.', 400)
    );
  }

  //Check User
  const user = await User.findOne({ email }).select('+password');
  console.log(user);

  if (!user) {
    return next(new ErrorResponse('Invalid Credential.', 401));
  }
  if (!user.isActive) {
    return next(new ErrorResponse('You are not confirmed user', 401));
  }

  //Check password
  const isMath = await user.mathPassword(password);

  if (!isMath) {
    return next(new ErrorResponse('Invalid Credential.', 401));
  }
  sendTokenResponse(user, 200, res);
});

// @desc   get me
// @route   /api/v1/auth/me
// @access   Private
exports.getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    data: user,
  });
});
// @desc   logout an clear the cookie
// @route   /api/v1/auth/logout
// @access   Private
exports.logout = asyncHandler(async (req, res, next) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 0),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    data: {},
  });
});
// @desc   get me
// @route   /api/v1/auth/forgot-password
// @access   public
exports.forgotPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorResponse('The email address is not valid', 404));
  }

  //get reset token
  const resetToken = user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false });
  ///Create URL
  // const resetUrl = `http://localhost:3000/auth/reset-password/${resetToken}`;

  // const resetUrl = `${req.protocol}://${req.get(
  //   'host'
  // )}/auth/reset-password/${resetToken}`;

  const resetUrl = `${req.body.clientUrl}/auth/reset-password/${resetToken}`;

  const message = `You are receiving this email because you has requested the reset
  of a password, Please make a PUT request to: \n\n ${resetUrl}`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Password reset token',
      message,
    });
    res.status(200).json({
      success: true,
      message: 'Email Send Successfully',
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });

    return next(new ErrorResponse('Email could not be sent', 500));
  }
});

// @desc   get me
// @route   /api/v1/auth/reset-password/:resettoken
// @access   Private
exports.resetPassword = asyncHandler(async (req, res, next) => {
  //Get Hashed token
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.resettoken)
    .digest('hex');

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(new ErrorResponse('Invalid Token.', 401));
  }

  //Set New Password
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();
  sendTokenResponse(user, 200, res);
});

// @desc   update user detail by user
// @route   /api/v1/auth/update-me
// @access   Private
exports.updateMe = asyncHandler(async (req, res, next) => {
  const updateField = {
    name: req.body.name,
    email: req.body.email,
    photoUrl: req.body.photoUrl,
  };

  const user = await User.findByIdAndUpdate(req.user.id, updateField, {
    new: true,
    runValidators: true,
  });

  sendTokenResponse(user, 200, res);
});
// @desc   update user Password by user
// @route   /api/v1/auth/update-password
// @access   Private
exports.updatePassword = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).select('+password');

  //Check current password
  if (!(await user.mathPassword(req.body.currentPassword))) {
    return next(new ErrorResponse('Current Password not match.', 401));
  }

  user.password = req.body.newPassword;

  await user.save();
  sendTokenResponse(user, 200, res);
});

// @desc   Create a user
// @route   /api/v1/auth/register
// @access   Public

exports.customerRegister = asyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body;

  //Create a new user
  const user = await User.create({
    name,
    email,
    password,
    role: 'customer',
  });

  sendTokenResponse(user, 200, res);
});

// @desc   get me
// @route   /api/v1/auth/confirm-user/:resettoken
// @access   Private
exports.confirmUser = asyncHandler(async (req, res, next) => {
  //Get Hashed token
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.resettoken)
    .digest('hex');

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(new ErrorResponse('Invalid Token.', 401));
  }

  //Set New Password
  user.isActive = true;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();
  sendTokenResponse(user, 200, res);
});
