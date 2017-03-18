(function () {
  'use strict';

  angular
    .module('mean.lms')
    .config(customer);

  customer.$inject = ['$stateProvider'];

  function customer($stateProvider) {
    $stateProvider.state('customer example page', {
      url: '/customer/example',
      templateUrl: 'lms/views/index.html'
    }).state('manage customers',{
      url:'/customer/manage_customers',
      templateUrl:'lms/views/manage_customers.html',
     }).state('customer report',{
      url:'/customer/customer_report',
      templateUrl:'lms/views/customer_report.html',
     })
  }

})();
