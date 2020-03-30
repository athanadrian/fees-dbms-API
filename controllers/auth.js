const crypto = require('crypto');
const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../utils/asyncHandler');
const sendEmail = require('../utils/sendEmail');

// Helper function to get token from model create cookie and send back response
const sendTokenResponse = (user, statusCode, res) => {
  const token = user.getSignedJwtToken();
  const options = {
    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
    httpOnly: true
  };

  if (process.env.NODE_ENV === 'production') {
    options.secure = true;
  }

  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({
      success: true,
      token
    });
};

//@desc         Singup - Register User
//@route        POST /api/v1/auth/signup
//@access       Public
exports.singup = asyncHandler(async (req, res, next) => {
  const { username, email, password, passwordConfirm } = req.body;
  const newUser = await User.create({
    username,
    email,
    password,
    passwordConfirm
  });

  // Log user in. Send JWT
  sendTokenResponse(newUser, 201, res);
});

//@desc         Singin - Login User
//@route        POST /api/v1/auth/signin
//@access       Public
exports.signin = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // Check if email and password exists
  if (!email || !password) {
    return next(new ErrorResponse('Please provide email and password.', 400));
  }
  // Check if user exists
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    return next(new ErrorResponse('Invalid credentials', 401));
  }

  // Check if password matches
  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    return next(new ErrorResponse('Invalid credentials', 401));
  }
  // Log user in. Send JWT
  sendTokenResponse(user, 200, res);
});

//@desc         Forgot Password
//@route        POST /api/v1/auth/forgot-password
//@access       Public
exports.forgotPassword = asyncHandler(async (req, res, next) => {
  // 1) Get user via user's email
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return next(new ErrorResponse('User with this email address does not exist.', 404));
  }
  // 2) Generate a random resetToken
  const resetToken = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });
  // 3) Send resetToken via email
  const resetUrl = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/auth/reset-password/${resetToken}`;

  const message = `You are receiving this email because you (or someone else) 
  has requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl}.\n
  If did not forget your password, please ignore this email.`;
  try {
    await sendEmail({
      email: user.email,
      subject: 'Your password reset token (valid for 10 min)',
      message
    });
    res.status(200).json({
      status: 'success',
      message: 'You atempted to change your password. Email has been send'
    });
  } catch (error) {
    console.log(error);

    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });
    return next(new ErrorResponse('Email could not be sent', 500));
  }
});

//@desc         Reset Password
//@route        PATCHE /api/v1/auth/reset-password/:resetToken
//@access       Public
exports.resetPassword = asyncHandler(async (req, res, next) => {
  // Get hased password
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.resetToken)
    .digest('hex');

  // If token has not expired and there is a user set password
  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() }
  });
  if (!user) {
    return next(new ErrorResponse('Invalid Token', 400));
  }

  // Set new password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  // Log user in. Send JWT
  sendTokenResponse(user, 200, res);
});

//@desc         Update User Password
//@route        PATCHE /api/v1/auth/update-user-password
//@access       Private
exports.updateUserPassword = asyncHandler(async (req, res, next) => {
  // 1) Get user
  const user = await User.findById(req.user.id).select('+password');

  // Check if paasword is correcy
  if (!(await user.matchPassword(req.body.passwordCurrent))) {
    return next(new ErrorResponse('Paswword does not match.', 400));
  }
  // Update password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();

  // Log user in. Send JWT
  sendTokenResponse(user, 200, res);
});
