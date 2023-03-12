const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const app = express();
const globalErrorHandler = require('./controllers/errorController');
const AppError = require('./utils/appError');

//
//
// API Router Import
//
const PropertyRouter = require('./routes/propertyRoutes');
const userRouter = require('./routes/userRouter');

//
//
//Middleware
//
app.use(morgan('dev'));
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

//
//
// Routs Middleware
//
app.use('/api/v1/properties', PropertyRouter);
app.use('/api/v1/users', userRouter);

//
//
// Handle unhandled Routes After all defined Routes
//
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on Server!`, 500));
});

//
//
// Global Error Handler (err,req,res,next)
//
app.use(globalErrorHandler);

//
module.exports = app;
