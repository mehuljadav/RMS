const express = require('express');
const userController = require('./../controllers/userController');
const authController = require('./../controllers/authController');
const router = express.Router();

//
//
// User Router
//

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/logout', authController.logout);

// userController.uploadUserPhoto,
// userController.resizeUserPhoto,
router.get('/me', authController.protect, userController.getMe);
router.delete('/deleteMe', authController.protect, userController.deleteMe);
//router.post('/activateMe', userController.activateMe);

router
  .route('/')
  .get(
    authController.protect,
    authController.restrictTo('admin'),
    userController.getAllUser
  )
  .post(authController.protect, userController.createUser);

router
  .route('/:id')
  .get(
    authController.protect,
    authController.restrictTo('admin'),
    userController.getUser
  )
  .put(
    authController.protect,
    authController.restrictTo('admin'),
    userController.updateUser
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin'),
    userController.deleteUser
  );

module.exports = router;
