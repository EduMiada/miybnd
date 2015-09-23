'use strict';

/**
 * Module dependencies.
 */
var passport = require('passport'),
	LocalStrategy = require('passport-local').Strategy,
	User = require('mongoose').model('User');

module.exports = function() {
	
	//console.log('passport-local');
	
	// Use local strategy
	
	
	passport.use(new LocalStrategy({
			usernameField: 'username',
			passwordField: 'password'
		},
		function(username, password, done) {
			//console.log(username);
			
			//User.findOne({username: username}, function(err, user) {
			User.findOne({username: username})
				.populate('selectedBand','name')
				.exec(function(err, user) {

				//console.log('locals',  user);


				if (err) {
					return done(err);
				}
				if (!user) {
					console.log('Unknown user or invalid password 1');
					return done(null, false, {
						message: 'Unknown user or invalid password'
					});
				}
				if (!user.authenticate(password)) {
					console.log('Unknown user or invalid password 2');
					return done(null, false, {
						message: 'Unknown user or invalid password'
					});
				}

				return done(null, user);
			});
		}
	));
};
