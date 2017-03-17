'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Bill Schema
 */

var BillSchema = new Schema({

    customerId: {
        type: Schema.Types.ObjectId,
        ref: 'Customers'
    },

    billNumber: {
        type: Number,
        required: false
    },

    billDate: {
        type: Date,
        required: true,
    },

    items: {
        type: Array,
        required: true
    },

    discount: {
        type: Number,
        required: true,
    },

    tax: {
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

var Bill = mongoose.model('Bill', BillSchema);

// BillSchema.pre('save', function (next) {
//     var now = new Date();
//     var year = now.getFullYear();
//     var month = now.getMonth() + 1;

//     this.updateAt = now;
//     if (!this.createdAt) {
//         this.createdAt = now;
//     }
//     next();
// });


BillSchema.pre('save', function (next) {
    var now = new Date();
    this.updateAt = now;
    if (!this.createdAt) {
        this.createdAt = now;
    }
    var doc = this;
    // For auto incremental bill number.
    Bill.findOne({}).sort({ 'createdAt': -1 }).limit(1).exec(function (error, latestBIll) {
        if (error) return next(error);
        if (latestBIll != null
            && latestBIll != undefined
            && latestBIll.billNumber != ''
            && latestBIll.billNumber != undefined) {
            doc.billNumber = latestBIll.billNumber + 1;
        } else {
            doc.billNumber = parseInt('0001');
        }
        next();
    });
});
