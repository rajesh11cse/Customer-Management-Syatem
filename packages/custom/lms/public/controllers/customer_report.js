'use strict';

angular.module('mean.system').controller('customer_report_Ctrl',['SessionService', '$scope','$http','Global', 'toaster', 'httpErrorService', 'spinnerService', '$location',
	function(SessionService, $scope, $http, Global, toaster, httpErrorService, spinnerService, $location){
	    $scope.limit                = 5;  
	    $scope.currentPage          = 1;
	    $scope.maxSize              = 5;
	    $scope.showCustomerReport   = false;
		$scope.billsThere = false;


		// Fuction callSuccessError to show sucees or error message /
	    $scope.callSuccessError = function(type, title){
	      toaster.pop({type: type, title: title});// Dispay a flash on brower along with title(message).
	    };



		// Show the the list of customer report.
		$scope.runScript = function(){
			spinnerService.show('userSpinner');
			$http.post('/api/lms/generateBill').success(function(data){
				if(data.result == 'Success'){
					$scope.billsThere = true;
					$scope.callSuccessError('success', 'Thausand of bills genereted successfully');
                    spinnerService.hide('userSpinner');
				}else{
					$scope.billsThere = false;
	      			$scope.callSuccessError('error', "Script error");
				}
				spinnerService.hide('userSpinner');
			}).error(function (data, status){
			  	spinnerService.hide('userSpinner');
	          	var httpError = httpErrorService.httpErrorMessage(data, status);
	         	$scope.callSuccessError('error', httpError);
			});
		};


		// Get customer report.
		$scope.getCustomerReport = function(){
			spinnerService.show('userSpinner');
			$http.post('/api/lms/getCustomerReport').success(function(data){
				if(data.result == 'Success' && data.data.length>0){
					$scope.showCustomerRecord = true;
					$scope.customerReport  = data.data;
                    spinnerService.hide('userSpinner');
				}else{
				 spinnerService.hide('userSpinner');
	      		 $scope.callSuccessError('error', 'No record found in database');
				}
				spinnerService.hide('userSpinner');
			}).error(function (data, status){
			  	spinnerService.hide('userSpinner');
	          	var httpError = httpErrorService.httpErrorMessage(data, status);
	         	$scope.callSuccessError('error', httpError);
			});
		};



		// Get Bills.
		$scope.getBills = function(limit, pageNumber){
			spinnerService.show('userSpinner');
			$http.get('/api/lms/getBills').success(function(data){
				if(data.result == 'Success' && data.data.length>0){
					 $scope.billsThere = true;
                     spinnerService.hide('userSpinner');
				}else{
					$scope.billsThere = false;
				    spinnerService.hide('userSpinner');
	      		    $scope.callSuccessError('error', 'No bills found in database');
				}
				spinnerService.hide('userSpinner');
			}).error(function (data, status){
			  	spinnerService.hide('userSpinner');
	          	var httpError = httpErrorService.httpErrorMessage(data, status);
	         	$scope.callSuccessError('error', httpError);
			});
		};


		$scope.pageChanged = function() {
           $scope.get_all_customers($scope.limit, $scope.currentPage);
	     };

	}]);