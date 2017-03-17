(function () {
  'use strict';

  /* jshint -W098 */
  // The Package is past automatically as first parameter
  module.exports = function (Lms, app, auth, database) {

    var manage_customers = require('../controllers/manage_customers');

    app.get('/api/lms/example/anyone', function (req, res, next) {
      res.send('Anyone can access this');
    });

    app.get('/api/lms/example/auth', auth.requiresLogin, function (req, res, next) {
      res.send('Only authenticated users can access this');
    });

    app.get('/api/lms/example/admin', auth.requiresAdmin, function (req, res, next) {
      res.send('Only users with Admin role can access this');
    });

    // API for add customers
    app.route('/api/lms/add_customers')
      .post(manage_customers.add_customers);

    // API for get customers
    app.route('/api/lms/get_customers')
      .post(manage_customers.get_customers);

    // API for remove customers
    app.route('/api/lms/remove_customer')
      .delete(manage_customers.remove_customer);

  
    // API for remove customers
    app.route('/api/lms/update_customer')
      .put(manage_customers.update_customer);



    app.get('/api/lms/example/render', function (req, res, next) {
      Lms.render('index', {
        package: 'lms'
      }, function (err, html) {
        //Rendering a view from the Package server/views
        res.send(html);
      });
    });
  };
})();
