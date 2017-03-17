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



function billItems(size, callback){
    for(var i = 0; i<size; i++){

        var itemObj = {
                name : '',
                quantity : '',
                Rate : '',
                tax : '',
            }

        if(i == size){
            callback();
        }
    }
}





 exports.generateBill = function(req, res){
    Customers.find({"_id" : {$exists:true}}, {"_id":1}).exec(function(err,custIds){
    if(err){
        res.status(400).json({'result':'Error','data':err})
    }
    else{
        //console.log(custIds);
        console.log(faker.date.future());
        console.log(faker.name.firstName());
        var descount = Math.floor(Math.random() * 98) + 5  
        console.log(descount);
        var tax = Math.floor(Math.random() * 98) + 5 
         console.log(tax);
          var rate = Math.random() * (1 - 0.1) + 0.1;
          console.log(rate.toFixed(1))
         var itemSize = Math.floor(Math.random() * 10) + 1 
        // for(var i = 0; i<15; i++){
        //     var item = custIds[Math.floor(Math.random()*custIds.length)];
        //     console.log(item._id);


        //     var 
        //     var bill = new Bill(req.body);
           
            // async.eachSeries(custIds, function(data, callback){

              
            //     billItems(itemSize, function(err, data){
            //         if(err){
            //             console.log("err")
            //         }else{
            //             console.log(data);

            //               var billObj = {
            //         billDate : '',
            //         items : '',
            //         discount : '',
            //         tax : '',
            //     }


            //         }
            //     })
				//  bill.save(function(err, customer){
                //     if(err){
                //     // if error is occured, handle error
                //     res.status(400).json({'result':'Error','data':err})
                //     }else{
                //         bill(req,res);
                //     }
                // })
        //         console.log(data._id);
		// 		callback();
		// 	}, function(err){
		// 		if(err){
		// 			//$scope.callSuccessError('error', err);
		// 		}else{
        //             console.log("success");
		// 		//	$scope.addressList.push({id : 0, flat : '',  street : '',  state : '',  pinCode : ''});
		// 		}
		// 	});
         }
    });
}