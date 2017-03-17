'use strict';

angular.module('mean.system').controller('manage_customers_Ctrl',['SessionService', '$scope','$http','Global', 'toaster', 'httpErrorService', 'spinnerService', '$location',
	function(SessionService, $scope, $http, Global, toaster, httpErrorService, spinnerService, $location){
	    $scope.limit                =5;  
	    $scope.currentPage          = 1;
	    $scope.maxSize              = 5;
	    $scope.show_customers           = false;
	    $scope.show_customers_form      = false;
	    $scope.user                 = {};// initialize user attributs or params as empty object 


		// Fuction callSuccessError to show sucees or error message /
	    $scope.callSuccessError = function(type, title){
	      toaster.pop({type: type, title: title});// Dispay a flash on brower along with title(message).
	    };


    //>>>>>>>>>>>>>>>>> Calendar for Date of Birth >>>>>>>>>>>>>>//
	    $scope.today = function() {
	  		$scope.dob = new Date();
	    };
	    $scope.today();
	    /*$scope.dateOptions = {
	      	formatYear: 'yy',
	      	maxDate: new Date(),
	      	startingDay: 1
	    };

	    $scope.open = function() {
	      $scope.popup.opened = true;
	    };

	    $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
	    $scope.format = $scope.formats[0];

	    $scope.popup = {
	      	opened: false
	    };*/

		 // Show the the list of customers.
		$scope.get_all_customers = function(limit, pageNumber){
			$scope.show_customers = false; 
			spinnerService.show('userSpinner');
			$http.post('/api/lms/get_customers', {limit:limit, pageNumber:pageNumber}).success(function(data){
				if(data.result == 'Success' && data.data.length>0){
					$scope.show_customers = true;
					$scope.get_customers  = data.data;
					$scope.total_customers = data.count;
					$scope.indexIncrement = $scope.currentPage > 0 ? (($scope.currentPage-1)*$scope.limit): 0;
				}else{
					$scope.show_customers = false; 
	      			$scope.callSuccessError('error', 'No customer found in database');
				}
				spinnerService.hide('userSpinner');
			}).error(function (data, status){
			  	spinnerService.hide('userSpinner');
	          	var httpError = httpErrorService.httpErrorMessage(data, status);
	         	$scope.callSuccessError('error', httpError);
			});
		};


   // Default address obj
    $scope.addressList        = [{id : 0, flat : '',  street : '',  state : '',  pinCode : ''}];
    $scope.addressListFinal   = [];
   
    // Dynamicly adding row in addressList
    $scope.addNewAddess = function(index, data) {
        if(!data || !data.flat|| !data.street || !data.state || !data.pinCode){
            $scope.addressError = true;
            $scope.addressErrorMessage = 'All fields are required';
        }else{
          $scope.addressError = false;
          if($scope.addressList.length < 6){
              $scope.addressList.push({'id': index, flat : data.flat, street : data.street, state : data.state, pinCode : data.pinCode});
              $scope.addressListFinal.push({'id': index, flat : data.flat, street : data.street, state : data.state, pinCode : data.pinCode});
          }else{
            flash.info='You are not allowed to add more then 5 address.';
          }
        }
    };

    // Dynamicly remove row from addressList
    $scope.removeAddess = function(index) {
        if($scope.addressList.length >1){
            $scope.addressList.splice(index,1);
            $scope.addressListFinal.splice(index,1);
        }
    };

    $scope.newCustomer = function() {
        $scope.show_customers_form = true; 
		$scope.show_customers=false;
		$scope.showUpdate = false;
		$scope.customers = '';
		$scope.addressList        = [{id : 0, flat : '',  street : '',  state : '',  pinCode : ''}];
		$scope.addressListFinal   = [];
    };



       // Add customers.
		$scope.add_customers = function(customer){
			if(customer && $scope.addressListFinal.length>0){
				var customer_Obj = {
					'name'             : customer.name,
					'mobile'       	   : customer.mobile,
					'phone'    : customer.phone,
					'address'	          : $scope.addressListFinal,
					'dob'                : $scope.dob, 
					'email'           :customer.email,
					'limit'                : $scope.limit, 
					'pageNumber'           : $scope.pageNumber
				}

				console.log(customer_Obj)
				$http.post('/api/lms/add_customers', customer_Obj).success(function(data){
					if(data.result == 'Success' && data.data.length>0){
						$scope.show_customers_form  = false;
						$scope.show_customers     = true;
						$scope.get_customers 	 = data.data;
						$scope.total_customers 	 = data.count;
						 $scope.addressList        = [{id : 0, flat : '',  street : '',  state : '',  pinCode : ''}];
						$scope.indexIncrement = $scope.currentPage > 0 ? (($scope.currentPage-1)*$scope.limit): 0;
						$scope.callSuccessError('success', 'Customer has been added successfully');
					}else{
						$scope.show_customers_form  = false;
						$scope.show_customers = false;
		      			$scope.callSuccessError('error', 'No customers found in database');
					}
				}).error(function (data, status){
		          	var httpError = httpErrorService.httpErrorMessage(data, status);
		         	$scope.callSuccessError('error', httpError);
				});
			}else{
				$scope.callSuccessError('error', '(*) required fields.');
			}
		}


 



		  // Edit customers details.
		$scope.edit_customer_details = function(data){
			$scope.show_customers_form  = true;
			$scope.showUpdate = true;
			$scope.show_customers     = false;
			$scope.customers = data;
			$scope.customer_id = data._id;
			$scope.addressList = []
			//console.log(data.address)

			// for(var i =0 ; i<data.address.length; i++){
			// 	$scope.addressList.push(data.address[i]);
			// }
			 async.eachSeries(data.address, function(add, callback){
				$scope.addressList.push(add);
				$scope.addressListFinal.push(add);
				callback();
			}, function(err){
				if(err){
					$scope.callSuccessError('error', err);
				}else{
					$scope.addressList.push({id : 0, flat : '',  street : '',  state : '',  pinCode : ''});
				}
			});
		}


// update customers detail.
		$scope.update_customer = function(customer){
			if(customer && $scope.addressListFinal.length>0){
				var customer_Obj = {
					'_id':$scope.customer_id,
					'name'             : customer.name,
					'mobile'       	   : customer.mobile,
					'phone'    : customer.phone,
					'address'	          : $scope.addressListFinal,
					'dob'                : $scope.dob, 
					'email'           :customer.email,
					'limit'                : $scope.limit, 
					'pageNumber'           : $scope.pageNumber
				}

				console.log(customer_Obj)
				$http.put('/api/lms/update_customer', customer_Obj).success(function(data){
					if(data.result == 'Success' && data.data.length>0){
						$scope.show_customers_form  = false;
						$scope.show_customers     = true;
						$scope.get_customers 	 = data.data;
						$scope.total_customers 	 = data.count;
						 $scope.addressList        = [{id : 0, flat : '',  street : '',  state : '',  pinCode : ''}];
						$scope.indexIncrement = $scope.currentPage > 0 ? (($scope.currentPage-1)*$scope.limit): 0;
						$scope.callSuccessError('success', 'Customer has been updated successfully');
					}else{
						$scope.show_customers_form  = false;
						$scope.show_customers = false;
		      			$scope.callSuccessError('error', 'No customers found in database');
					}
				}).error(function (data, status){
		          	var httpError = httpErrorService.httpErrorMessage(data, status);
		         	$scope.callSuccessError('error', httpError);
				});
			}else{
				$scope.callSuccessError('error', '(*) required fields.');
			}
		}




		// Delete customer.
		$scope.remove_customer = function(customer){
			 if(window.confirm('Are you sure you want to delete the customer ?')){
				$http.delete('/api/lms/remove_customer', {'id':customer._id, 'limit': $scope.limit, 'pageNumber': $scope.currentPage}).success(function(data){
					if(data.result == 'Success' && data.data.length>0){
						$scope.get_customers 	 = data.data;
						$scope.total_customers 	 = data.count;
						$scope.indexIncrement = $scope.currentPage > 0 ? (($scope.currentPage-1)*$scope.limit): 0;
						$scope.callSuccessError('success', 'Customer has been removed successfully');
					}else{
						$scope.show_customers_form  = false;
						$scope.show_customers = false;
		      			$scope.callSuccessError('error', 'No customers found in database.');
					}
				}).error(function (data, status){
		          	var httpError = httpErrorService.httpErrorMessage(data, status);
		         	$scope.callSuccessError('error', httpError);
				});
			}
		}

		$scope.pageChanged = function() {
           $scope.get_all_customers($scope.limit, $scope.currentPage);
	     };

	}]);