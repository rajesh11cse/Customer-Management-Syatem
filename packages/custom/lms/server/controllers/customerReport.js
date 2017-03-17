 'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Customers = mongoose.model('Customers'),
  Bill = mongoose.model('Bill'),
  faker = require('faker'),
  async = require('async');


/**
 * Get customers
 */



function billItems(size, callback) {
    var itmeArray = []
    for (var i = 0; i < size; i++) {
        var itemObj = {
            name: faker.hacker.noun(),
            quantity: Math.floor(Math.random() * 5) + 1,
            Rate: (Math.random() * (1 - 0.1) + 0.1).toFixed(1),
        }
        itmeArray.push(itemObj);
        if (i == size-1) {
            callback(itmeArray);
        }
    }
}





 exports.generateBill = function(req, res){
    Customers.find({"_id" : {$exists:true}}, {"_id":1}).exec(function(err,custIds){
    if(err){
        res.status(400).json({'result':'Error','data':err})
    }
    else{
       // console.log(faker.name.firstName());
         var itemSize = Math.floor(Math.random() * 10) + 1 
         billItems(itemSize, function(data, err, next){
            if(err){
               //error occure.
            }else{
                var items = data;
                var billEntrySize = new Array(2000);//create an empty array with length 45
                async.eachSeries(billEntrySize, function(data, callback){
                    var billObj = {
                        customerId : custIds[Math.floor(Math.random()*custIds.length)]._id,
                        billDate : faker.date.future(),
                        items : items,
                        discount : Math.floor(Math.random() * 98) + 5,
                        tax : Math.floor(Math.random() * 8) + 5
                    }
                    console.log(billObj);
                    var bill = new Bill(billObj);
                    bill.save(function(err, customer){
                        if(err){
                            console.log("bill error generating..")
                            callback();
                        }else{
                            console.log("bill generating..")
                            callback();
                        }
                    });
                }, function(err){
                    if(err){
                        console.log("error")
                    }else{
                         Bill.find({}).sort({'createdAt':-1}).exec(function(err,data){
                            if(err){
                                res.status(400).json({'result':'Error','data':err})
                            }else{
                                //console.log(data)
                                res.status(200).json({'result':'Success','data':data})
                            }
                        });
                    }
                });
              }
           });
         }
    });
}