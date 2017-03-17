 'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Customers = mongoose.model('Customers'),
  config = require('meanio').loadConfig()



/**
 * Get customers
 */

 function get_customers(req, res){
   Customers.find({}).skip(req.body.pageNumber > 0 ? ((req.body.pageNumber-1)*req.body.limit): 0).limit(req.body.limit).sort({'createdAt':-1}).exec(function(err,users){
    if(err){
      res.status(400).json({'result':'Error','data':err})
    }
    else{
      Customers.count(function(err,count){
        if(err){
          res.status(400).json({'result':'Error','data':err})
        }
        else{
          res.status(200).json({'result':'Success','data':users, 'count':count})
        }
      });
    }
  });
 }

exports.get_customers=function(req,res){
  get_customers(req,res);
}


/**
 * Add customer
 */
exports.add_customers = function(req, res) {
//   req.assert('customerName', 'You must select a customer name').notEmpty(); // Validate customer name
//   req.assert('authorName', 'You must enter a author name').notEmpty(); // Validate author name
//   req.assert('quantity', 'You must enter a quantity').notEmpty(); // Validate quantity
//   // It fills an array object if errors exist:
//   var errors = req.validationErrors();
//   if (errors) {//If errors were found. Return a validation error!
//     if(errors[0].param === 'customerName'){
//       // Display an error for customerName
//       return res.status(400).send({result:"Error", message: errors[0].msg });
//     }else if(errors[0].param === 'authorName'){
//       // Display an error for authorName
//       return res.status(400).send({result:"Error", message: errors[0].msg });
//     }else if(errors[0].param === 'quantity'){
//       // Display an error for quantity
//       return res.status(400).send({result:"Error", message: errors[0].msg });
//     }
//   }
  var customers = new Customers(req.body);
  customers.save(function(err, customer){
    if(err){
      // if error is occured, handle error
      res.status(400).json({'result':'Error','data':err})
    }else{
      get_customers(req,res);
    }
  })
};

/**
 * Remove/Delete customer
 */
exports.remove_customer = function(req,res){ 
  Customers.findOneAndRemove(req.body.id, function(err,users){
    if(err){
      res.status(400).json({result:'Error', data:err})
    }
    else{
      get_customers(req,res);
    }
  });
}



exports.update_customer = function(req,res){ 
  console.log(req.body)
  var query = {$set:{name : req.body.name, mobile : req.body.mobile, 
    phone : req.body.phone, address : req.body.address, 
    dob : req.body.dob, email : req.body.email, }}

  Customers.findByIdAndUpdate(req.body._id, query, function(err,users){
    if(err){
      console.log("dddd")
      res.status(400).json({result:'Error', data:err})
    }
    else{
      console.log("ddddss")
      
      get_customers(req,res);
    }
  });
}