const { promisify } = require('util');
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
  res.cookie('jwt', token, {
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
    data: {
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
    },
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
    return next(new AppError('Please provide Email and Password!', 401));
  }

  // 1. Check Email is available or not
  const user = await User.findOne({ email });
  if (!user) {
    return next(new AppError('User not found with this Email Id', 401));
  }

  // 2. Verify Password
  if (!user || !(await user.passwordCorrect(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }

  createSendToken(user, 200, req, res);
});

//
//
// Protect route Controller
//
exports.protect = catchAsync(async (req, res, next) => {
  // 1. check user logged in or not
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = `${req.headers.authorization}`.split(' ')[1];
  } else {
    token = req.cookies.jwt;
  }
  console.log('Header Token', token);
  if (!token) {
    return next(
      new AppError('You are not logged in! Please log in to get access.', 401)
    );
  }

  // 2. verify Token
  const decodedUser = await promisify(jwt.verify)(
    token,
    process.env.JWT_SECRET
  );
  if (!decodedUser) {
    return next(new AppError('User loggedout, please login again', 401));
  }

  // 3. check user still exist
  const currentUser = await User.findById(decodedUser.id);
  if (!currentUser) {
    return next(new AppError('User not found, please login again', 401));
  }
  req.user = currentUser;

  next();
});

//
//
// logout User
// No need to pass next and no need to use async await. because we are not going to retrive data from database
//
exports.logout = (req, res) => {
  res
    .cookie('jwt', 'loggedout', {
      expires: new Date(Date.now() + 2 * 1000),
      httpOnly: true,
    })
    .status(200)
    .json({
      status: 'success',
    });
};

//
//
//  Restrict to user
//
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You are not authorized to access this page.', 403)
      );
    }
    next();
  };
};
