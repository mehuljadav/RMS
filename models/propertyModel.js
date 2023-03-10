const mongoose = require('mongoose');
const validator = require('validator');

//title, description, price, address, city, state, zipCode,
//country, images, bedrooms, bathrooms, area, type, status, features, user, created, and modified.
// "title":"Sargasan Flat",
// "description":"Buy best properties in Sargasan, Gandhinagar.",
// "price":500000,
// "address":"Shikshapatri",
// "city":"Gandhinagar",
// "state":"Gujarat",
// "zipCode":363110,
// "image":"img-01.jpg",
// "bedrooms":4,
// "bathrooms":3,
// "area":108,
// "type":"house",
// "status":"for sale",
// "features":"Fully Furnised",

const propertySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Property name is required!'],
    minlength: [2, 'Property must be 2 character long!'],
    maxlength: [50, 'Property must be 50 character long!'],
    trime: true,
  },
  description: {
    type: String,
    required: [true, 'Please provide Property details!'],
    maxlength: [
      500,
      'Description should be less than or equal to 500 characters',
    ],
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [1, 'Price should be greater than or equal to 1'],
  },
  address: {
    type: String,
    required: [true, 'Address is required'],
  },
  city: {
    type: String,
    required: [true, 'City is required'],
  },
  state: {
    type: String,
    required: [true, 'State is required'],
  },
  zipCode: {
    type: String,
    required: [true, 'Zip code is required'],
    validate: function (value) {
      validator.isPostalCode(value, 'IN');
    },
    message: 'Invalid  Postal Code...',
  },
  images: {
    type: [String],
  },
  bedrooms: {
    type: Number,
    required: [true, 'Number of bedrooms is required'],
    min: [0, 'Number of bedrooms should be greater than or equal to 0'],
  },
  bathrooms: {
    type: Number,
    required: [true, 'Number of bathrooms is required'],
    min: [0, 'Number of bathrooms should be greater than or equal to 0'],
  },
  area: {
    type: Number,
    required: [true, 'Area is required'],
    min: [0, 'Area should be greater than or equal to 0'],
  },
  type: {
    type: String,
    enum: ['house', 'apartment', 'farm-house'],
    required: [true, 'Type is required'],
  },
  status: {
    type: String,
    enum: ['for sale', 'for rent'],
    required: true,
  },
  features: {
    type: [String],
  },
  user: {
    type: Number,
    // type: mongoose.Schema.Types.ObjectId,
    // ref: 'User',
    required: true,
  },
  created: {
    type: Date,
    default: Date.now,
  },
  modified: {
    type: Date,
    default: Date.now,
  },
});

const Property = mongoose.model('Property', propertySchema);
module.exports = Property;
