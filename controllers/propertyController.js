const Property = require('./../models/propertyModel');
const catchAsync = require('./../utils/catchAsyncError');
const AppError = require('./../utils/appError');

exports.getAllProperties = catchAsync(async (req, res, next) => {
  let property = await Property.find();

  if (!property) {
    next(new AppError('Properties not found.', 404));
  }
  res.status(200).json({
    status: 'success',
    length: property.length,
    data: property,
  });
});
exports.createProperty = catchAsync(async (req, res) => {
  const property = await Property.create(req.body);

  // No need to check property

  res.status(200).json({
    status: 'success',
    data: property,
  });
});

exports.getProperty = catchAsync(async (req, res, next) => {
  const property = await Property.findById(req.params.id);
  if (!property) {
    return next(
      new AppError(
        `Property Not Found with Requested ID: ${req.params.id}`,
        404
      )
    );
  }

  res.status(200).json({
    status: 'success',
    data: property,
  });
});

exports.updateProperty = catchAsync(async (req, res, next) => {
  const property = await Property.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!property) {
    return next(
      new AppError(
        `Property Not Found with Requested ID: ${req.params.id}`,
        404
      )
    );
  }
  res.status(200).json({
    status: 'success',
    msg: `Proerty Updated successfully for ${req.params.id}`,
    data: property,
  });
});

exports.deleteProperty = catchAsync(async (req, res, next) => {
  const property = await Property.findByIdAndDelete(req.params.id);
  if (!property) {
    return next(
      new AppError(`Property not available with ID: ${req.params.id}`, 404)
    );
  }
  res.status(200).json({
    status: 'success',
    data: null,
  });
});
