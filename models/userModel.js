const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');

//firstName, lastName, email, password, phone, role, created, and modified.

const userSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: [true, 'firstname is Required!'],
    trim: true,
    minlength: [2, 'Firstname must be 2 character long!'],
    maxlength: [10, 'Firstname must be 10 character long!'],
  },
  lastname: {
    type: String,
    required: [true, 'Lastname is Required!'],
    trim: true,
    minlength: [2, 'Lastname must be 2 character long!'],
    maxlength: [10, 'Lastname must be 10 character long!'],
  },
  email: {
    type: String,
    required: [true, 'Please enter User Email Address!'],
    validate: [validator.isEmail, 'Insert Valid Email Address!'],
    lowercass: true,
    unique: true,
  },
  phone: {
    type: String,
    required: true,
    validate: {
      validator: function (value) {
        return validator.isMobilePhone(value, 'en-IN');
      },
      message: 'Invalid mobile number!',
    },
  },
  avatar: {
    type: String,
    default: 'default.png',
  },
  password: {
    type: String,
    required: [true, 'Please enter strong password!'],
    minlength: [6, 'Password Must be 6 Character Long!'],
    maxlength: [20, 'Password must be shorter then 20 characters!'],
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'please enter Confrim password!'],
    validate: {
      validator: function (pc) {
        return pc === this.password;
      },
      message: 'Passwords are not same!',
    },
  },
  role: {
    type: String,
    emun: ['user', 'broker', 'admin'],
    default: 'User',
  },
  createAt: {
    type: Date,
    default: Date.now,
  },
  modifiedAt: {
    type: Date,
    default: Date.now,
  },
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

//
//
// Encrypt password using bcryptJs npm
//
userSchema.pre('save', async function (next) {
  // If password is not modified then do not encrypt it
  if (!this.isModified('password')) return next();
  //
  this.password = await bcrypt.hash(this.password, 12);

  // No need to store Confirm password in Database
  this.passwordConfirm = undefined;
});

//
//
// Compare Password
//
userSchema.methods.passwordCorrect = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};
//
//
// Encrypt password using bcryptJs npm
//

//
//
//  De-Activate user insted delete
//  this will innitiate on all find methods, it will return all documents which is not set as a active : false

userSchema.pre(/^find/, async function (next) {
  if (this.op === 'find') {
    this.find({ active: { $ne: false } });
  }
  next();
});

const User = mongoose.model('User', userSchema);
module.exports = User;
