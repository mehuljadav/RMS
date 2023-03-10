//
//
//    Error Handler for Development
//
errorHandlerDev = (err, res) => {
  return res.status(err.statusCode).json({
    status: err.status,
    statusCode: err.statusCode,
    name: err.name,
    message: err.message,
    error: err,
    stack: err.stack,
  });
};

//
//
//    Error Handler for Production
//
errorHandlerProd = (err, res) => {
  return res.status(err.statusCode).json({
    status: err.status,
    statusCode: err.statusCode,
    name: err.name,
    message: err.message,
  });
};

//
//
//    Other Error Handler for Production
//
castErrorHandler = (err, res) => {
  return res.status(err.statusCode).json({
    status: err.status,
    message: `Invalid ID: ${err.value}`,
  });
};
duplicatekeyErrorHandler = (err, res) => {
  return res.status(err.statusCode).json({
    status: err.status,
    message: `Duplcate Value for : ${Object.entries(err.keyValue)}`,
  });
};
validationErrorHandler = (err, res) => {
  return res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
};

//
//
//    Global Error Handler
//
module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'Error';

  //
  //
  // A) - ENV MODE: Production
  //
  if (process.env.MODE_ENV === 'production') {
    //
    // Limited error details for client
    //
    if (err.name === 'CastError') castErrorHandler(err, res);
    if (err.name === 'ValidationError') validationErrorHandler(err, res);
    if (err.code === 11000) duplicatekeyErrorHandler(err, res);
    else errorHandlerProd(err, res);
  }

  //
  //
  // B) - ENV MODE: Development
  //
  if (process.env.MODE_ENV === 'development') {
    errorHandlerDev(err, res);
  }
};
