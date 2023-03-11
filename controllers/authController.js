const User = require('../models/userModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsyncError');
const jwt = require('jsonwebtoken');

//
//
// Create New Send Token
//
const createSendToken = (user, statusCode, req, res) => {
  // 1. Generate new Token
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRESIN,
  });

  // 2. create new Cookies
  res.cookie('jtw', token, {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: req.secure || req.headers['x-forwarded-proto'] === 'https',
  });

  // 3. remove password from output
  user.password = undefined;

  // 3. Send user along with Token in cookie
  res.status(statusCode).json({
    status: 'success',
    token,
    data: user,
  });
};

//
//
// Signup User Controller
//
exports.signup = catchAsync(async (req, res, next) => {
  const user = await User.create({
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    email: req.body.email,
    phone: req.body.phone,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });
  if (!user) {
    return next(new AppError('Error, Cant signin!', 401));
  }

  createSendToken(user, 200, req, res);
});

//
//
// Login User Controller
//
exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new AppError('Please provide Email and Password!', 404));
  }

  // 1. Check Email is available or not
  const user = await User.findOne({ email });
  if (!user) {
    return next(new AppError('User not found with this Email Id', 404));
  }

  // 2. Verify Password
  if (!user || !(await user.passwordCorrect(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }

  createSendToken(user, 200, req, res);
});
