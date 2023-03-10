const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsyncError');
const AppError = require('./../utils/appError');
const catchAsyncError = require('./../utils/catchAsyncError');
const validator = require('validator');

exports.getAllUser = catchAsync(async (req, res, next) => {
  const user = await User.find();
  if (!user) {
    return next(new AppError('There is no users.', 404));
  }

  res.status(200).json({
    status: 'success',
    users: user.length,
    data: user,
  });
});

exports.createUser = catchAsync(async (req, res, next) => {
  const user = await User.create(req.body);
  if (!user) {
    return next(new AppError('User not created successfully.', 404));
  }

  res.status(201).json({
    status: 'success',
    data: user,
  });
});

exports.getUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(new AppError(`User not found with ID: ${req.params.id}`, 404));
  }

  res.status(200).json({
    status: 'success',
    data: user,
  });
});

exports.updateUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!user) {
    return next(new AppError(`User not found with ID: ${req.params.id}`, 404));
  }

  res.status(200).json({
    status: 'success',
    data: user,
  });
});

exports.deleteUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) {
    return next(new AppError(`User not found ID: ${req.params.id}`, 404));
  }

  res.status(200).json({
    status: 'success',
    data: null,
  });
});
