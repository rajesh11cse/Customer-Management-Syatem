'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * CustomerReport Schema
 */

var CustomerReportSchema = new Schema({
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

  email: {
    type: String,
    required: true,
  },

  NoOfBills: {
    type: Number,
    required: true,
  },

  Amount: {
    type: Number,
    required: true,
  },

  
  avgAmount: {
    type: Number,
    required: true,
  },
  
  

  createdAt: {
    type: Date,
  },

  updatedAt: {
    type: Date
  },

});

var CustomerReport = mongoose.model('CustomerReport', CustomerReportSchema);

CustomerReportSchema.pre('save', function (next) {
  var now = new Date();
  this.updateAt = now;
  if (!this.createdAt) {
    this.createdAt = now;
  }
  next();
});
