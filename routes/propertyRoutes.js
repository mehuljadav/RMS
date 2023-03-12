const express = require('express');
const propertyController = require('../controllers/propertyController.js');
const authController = require('../controllers/authController.js');

const router = express.Router();

//Properties Routes
router
  .route('/')
  .get(propertyController.getAllProperties)
  .post(
    authController.protect,
    authController.restrictTo('admin', 'broker'),
    propertyController.createProperty
  );

router
  .route('/:id')
  .get(propertyController.getProperty)
  .put(
    authController.protect,
    authController.restrictTo('admin', 'broker'),
    propertyController.updateProperty
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'broker'),
    propertyController.deleteProperty
  );

module.exports = router;
