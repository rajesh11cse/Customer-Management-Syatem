'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Customers Schema
 */

var CustomersSchema = new Schema({
  name: {
    type: String,
    required: true
  },

  mobile: {
    type: Number,
    required: true
  },

  phone: {
    type: Number,
    required: true
  },

  address: {
    type: Array,
    required: true
  },

  dob: {
    type: Date,
    required: true,
  },

  email: {
    type: String,
    required: true,
  },

  createdAt: {
    type: Date,
  },

  updatedAt: {
    type: Date
  },

});

var Customers = mongoose.model('Customers', CustomersSchema);

CustomersSchema.pre('save', function (next) {
  var now = new Date();
  var year = now.getFullYear();
  var month = now.getMonth() + 1;

  this.updateAt = now;
  if (!this.createdAt) {
    this.createdAt = now;
  }
  next();
});
