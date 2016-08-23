// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');
var bodyParser = require('body-parser');
var app        = express();
var morgan     = require('morgan');
var firebase = require('firebase');

// configure app
app.use(morgan('dev')); // log requests to the console

// configure body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port     = process.env.PORT || 8080; // set our port

firebase.initializeApp({
  databaseURL: 'https://test-16e6f.firebaseio.com',
  serviceAccount: 'Test-5be1e48188ea.json'
});

//var mongoose   = require('mongoose');
//mongoose.connect('mongodb://localhost/SMSSync'); // connect to our database
//var SmsUser     = require('./app/models/sms-user');

// ROUTES FOR OUR API
// =============================================================================

// create our router
var router = express.Router();
var db = firebase.database();
var smsuserRef = db.ref("smssyncuser");

// middleware to use for all requests
router.use(function(req, res, next) {
	// do logging
	console.log('Something is happening.');
	next();
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
	res.json({ message: 'hooray! welcome to our api!' });
});

// on routes that end in /bears
// ----------------------------------------------------
router.route('/SMSSync')

	// create a bear (accessed at POST http://localhost:8080/bears)
	.post(function(req, res) {

		//var smsUser = new SmsUser();		// create a new instance of the Bear model
		var smsUser = {};
		smsUser.number = req.body.from;  // set the bears name (comes from the request)
		smsUser.message = req.body.message;
		smsUser.secret = req.body.secret
		smsUser.device_id = req.body.device_id
		smsUser.sent_timestamp = req.body.sent_timestamp
		smsUser.message_id = req.body.message_id
		smsuserRef.push(smsUser, function(error) {
		  if (error) {
		    res.json({ message: 'Sms User could not be created!' });
		  } else {
		    res.json({ message: 'Sms User created!' });
		  }
		});
		// smsUser.save(function(err) {
		// 	if (err)
		// 		res.send(err);
		//
		// 	res.json({ message: 'Sms User created!' });
		// });


	})

	// get all the bears (accessed at GET http://localhost:8080/api/bears)
	.get(function(req, res) {
		// SmsUser.find(function(err, smsuser) {
		// 	if (err)
		// 		res.send(err);
		//
		// 	res.json(smsuser);
		// });
	});

// on routes that end in /bears/:bear_id
// ----------------------------------------------------
// router.route('/bears/:bear_id')
//
// 	// get the bear with that id
// 	.get(function(req, res) {
// 		Bear.findById(req.params.bear_id, function(err, bear) {
// 			if (err)
// 				res.send(err);
// 			res.json(bear);
// 		});
// 	})
//
// 	// update the bear with this id
// 	.put(function(req, res) {
// 		Bear.findById(req.params.bear_id, function(err, bear) {
//
// 			if (err)
// 				res.send(err);
//
// 			bear.name = req.body.name;
// 			bear.save(function(err) {
// 				if (err)
// 					res.send(err);
//
// 				res.json({ message: 'Bear updated!' });
// 			});
//
// 		});
// 	})
//
// 	// delete the bear with this id
// 	.delete(function(req, res) {
// 		Bear.remove({
// 			_id: req.params.bear_id
// 		}, function(err, bear) {
// 			if (err)
// 				res.send(err);
//
// 			res.json({ message: 'Successfully deleted' });
// 		});
// 	});


// REGISTER OUR ROUTES -------------------------------
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);
