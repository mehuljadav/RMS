const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsyncError');
const AppError = require('./../utils/appError');
const multer = require('multer');
const sharp = require('sharp');
//const upload = multer({ dest: 'public/img/users' });
//
//
// User Avtar Upload
//
const multerStorage = multer.memoryStorage();

// This function will check mime image type
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only images.', 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

//
//
// Upload single photo
//
exports.uploadUserPhoto = upload.single('avatar');

//
//
//  Resize image using Sharp NPM
//
exports.resizeUserPhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `user-${req.body.firstname}-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/users/${req.file.filename}`);

  next();
});

//
//
// Get All User
//
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

//
//
// Create new User
//
exports.createUser = catchAsync(async (req, res, next) => {
  res.status(500).json({
    status: 'Error',
    message: 'This route is not defined, Please signup!',
  });
});

//
//
// Get User by ID
//
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

//
//
//  Get Me
//

exports.getMe = catchAsync(async (req, res, next) => {
  //   const deactivatedUser = await User.findById(req.user.id).select('active');
  //   if (deactivatedUser.active === false) {
  //     return next(new AppError('Your Account is deactived, please active.', 401));
  //   }
  const user = await User.findById(req.user.id);
  if (!user) {
    return next(new AppError('Please login to access your profile', 401));
  }
  res.status(200).json({
    status: 'success',
    data: user,
  });
});

//
//
// Delete Me
//
exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });
  res
    .cookie('jwt', 'loggedOut', {
      expires: new Date(Date.now()),
      httpOnly: true,
    })
    .status(204)
    .json({
      status: 'success',
      data: null,
    });
  console.log('user deleted');
});

//
//  Update User
//
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

//
//
//  Delete User
//
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
