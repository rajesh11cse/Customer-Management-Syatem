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
     })//.state('manage users',{
    //   url:'/customer/manage_users',
    //   templateUrl:'lms/views/manage_users.html',
    // }).state('issue return customers',{
    //   url:'/customer/issue_return_customers',
    //   templateUrl:'lms/views/issue_return_customers.html',
    // }).state('library transactions',{
    //   url:'/customer/library_transactions',
    //   templateUrl:'lms/views/library_transactions.html',
    // });
  }

})();
