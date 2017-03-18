'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Customers = mongoose.model('Customers'),
    CustomerReport = mongoose.model('CustomerReport'),
    Bill = mongoose.model('Bill'),
    faker = require('faker'),
    async = require('async');


// create bill items
function billItems(callback) {
    var itemSize = Math.floor(Math.random() * 10) + 1;
    var itmeArray = []
    for (var i = 0; i < itemSize; i++) {
        var itemObj = {
            name: faker.hacker.noun(),
            quantity: Math.floor(Math.random() * 5) + 1,
            rate: (Math.random() * (100 - 10.50) + 10.50).toFixed(2),
        }
        itmeArray.push(itemObj);
        if (i == itemSize - 1) {
            callback(itmeArray);
        }
    }
}


// Get all _ids of customers using this callback function
function getIDsOfCustomers(callback) {
    Customers.find({ "_id": { $exists: true } }, { "_id": 1 }).exec(function (err, custIds) {
        if (err) {
            // error
            callback(true, err);
        }
        else {
            // success
            callback(false, custIds)
        }
    });
}

// Create bill final function.
function createBillNow(custIds, items, callback) {
    var billObj = {
        customerId: custIds[Math.floor(Math.random() * custIds.length)]._id,
        billDate: faker.date.future(),
        items: items,
        discount: Math.floor(Math.random() * 98) + 5,
        tax: Math.floor(Math.random() * 8) + 5
    }
    var bill = new Bill(billObj);
    bill.save(function (err, customer) {
        if (err) {
            // console.log("bill error generating..")
            callback();
        } else {
            //console.log("bill generating..")
            callback();
        }
    });
}



// Create bill using customres IDs function.
function createBillsByCustomerId(customerIDs, callback) {
    var billEntrySize = new Array(1000);//create an empty array with length 1000
    async.eachSeries(billEntrySize, function (data, callback) {
        // Before create bill make items
        billItems(function (data, err) {
            if (err) {
                //error occure.
                callback();
            } else {
                // Now create bills
                createBillNow(customerIDs, data, function (data, err) {
                    if (err) {
                        //error occure.
                        callback();
                    } else {
                        callback();
                    }
                });
            }
        });
    }, function (err) {
        if (err) {
            console.log("error")
        } else {
            callback();
        }
    });
}



// Bill Generate function 
exports.generateBill = function (req, res) {
    async.waterfall([
        getIDsOfCustomers,
        createBillsByCustomerId
    ], function (err, result) {
        if (err) {
            res.status(400).json({ 'result': 'Error', 'data': err })
        } else {
            //console.log(data)
            res.status(200).json({ 'result': 'Success' })
        }
    });
}


// Get all _ids of customers using this callback function
function getCustomers(callback) {
    Customers.find(function (err, customers) {
        if (err) {
            // error
            callback(true, err);
        }
        else {
            // success
            callback(false, customers)
        }
    });
}

// Get all bills of customers by customer id
function findBillsByCustomerId(customers, callback) {
    var customerReportData = [];
    async.eachSeries(customers, function (customerData, cbCustomer) {
        Bill.find({ customerId: customerData._id }, function (err, billData) {
            if (err) {
                callback(true, 'bill not generated.');
            } else {
                if(billData.length<1){
                    callback(true, 'bill not generated.');
                }
                var totalAmount = 0;
                async.eachSeries(billData, function (bill, cbBill) {
                    var rateQuantity = 0
                    async.eachSeries(bill.items, function (item, cbItem) {
                        rateQuantity = rateQuantity + item.rate * item.quantity
                        cbItem();
                    }, function (err) {
                        if (err) {
                            console.log("error")
                        } else {
                            var discountAmount = (rateQuantity * bill.discount) / 100;
                            var taxAmount = (discountAmount * bill.tax) / 100;
                            var amount = (rateQuantity - discountAmount + taxAmount);
                            totalAmount = totalAmount + parseFloat(amount);
                            cbBill();
                        }
                    });
                }, function (err) {
                    if (err) {
                        console.log("error")
                    } else {
                        var avgAmount = (totalAmount.toFixed(2) / billData.length)
                        var custReportObject = {
                            name: customerData.name,
                            mobile: customerData.mobile,
                            phone: customerData.phone,
                            email: customerData.email,
                            NoOfBills: billData.length,
                            amount: parseFloat(totalAmount.toFixed(2)),
                            avgAmount: parseFloat(avgAmount.toFixed(2))
                        }
                        var customerReport = new CustomerReport(custReportObject);
                        customerReport.save(function (err, custReport) {
                            if (err) {
                                console.log("error")
                            } else {
                                customerReportData.push(custReport);
                                cbCustomer();
                            }
                        });
                    }
                });
            }
        });
    }, function (err) {
        if (err) {
            console.log("error")
        } else {
            callback(false, customerReportData);
        }
    });
}


// Get Customer report function 
exports.getCustomerReport = function (req, res) {
    async.waterfall([
        getCustomers,
        findBillsByCustomerId
    ], function (err, result) {
        if (err) {
            res.status(400).json({ 'result': 'Error', 'data': err })
        } else {
            res.status(200).json({ 'result': 'Success', 'data': result })
        }
    });
}


// Get Bills function 
exports.getBills = function (req, res) {
    Bill.find(function (err, billData) {
        if (err) {
            res.status(400).json({ 'result': 'Error', 'data': err })
        } else {
            res.status(200).json({ 'result': 'Success', 'data': billData })
        }
    });
}
