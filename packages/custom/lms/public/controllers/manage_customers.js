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
	    $scope.dateOptions = {
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
	    };

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

       // Add customers.
		$scope.add_customers = function(customer){
			if(customer){
				var customer_Obj = {
					'name'             : customer.name,
					'mobile'       	   : customer.mobile,
					'phone'    : customer.phone,
					'address'	          : customer.address,
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