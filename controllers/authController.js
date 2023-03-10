const User = require('../models/userModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsyncError');
const jwt = require('jsonwebtoken');

//
//
// Signup User Controller
//
exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    email: req.body.email,
    phone: req.body.phone,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });
  // console.log(newUser._id);
  const Token = jwt.sign(
    { id: newUser._id, fname: newUser.firstname, lname: newUser.lastname },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRESIN,
    }
  );

  res.status(200).json({
    status: 'success',
    Token,
    data: newUser,
  });
});
