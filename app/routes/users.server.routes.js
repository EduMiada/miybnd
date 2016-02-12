'use strict';

/**
 * Module dependencies.
 */
var passport = require('passport');



module.exports = function(app) {
	// User Routes
	var users = require('../../app/controllers/users.server.controller');

	
	
	
	//api routes
	//authenticate and get user by user/pass or facebook oauth with accessToken
	app.route('/v1/api/authenticate').post(users.signin_API);
	app.route('/v1/api/users/:userId/currentband').put(users.checkToken_API,users.setCurrentBand);
    app.route('/v1/api/auth/facebook').post(users.facebookClientToken_API);
	app.route('/v1/api/users/:userId/bands').get(users.checkToken_API, users.listBands);
    app.route('/v1/api/auth/facebook').post(users.facebookClientToken_API);

    app.route('/v1/api/users/:userId/connectspotify').post(users.checkToken_API, users.connectSpotifyAccount_API_NEW);

    //set user profile picture
    app.route('/v1/api/users/:userId/picture').post(users.checkToken_API, users.picture);



	// Setting up the users profile api
	app.route('/users/me').get(users.me);
	app.route('/users').put(users.update);
   

	app.route('/users/accounts').delete(users.removeOAuthProvider);
	app.route('/users/:userId/bands').get(users.userBands);


	// Setting up the users password api
	app.route('/users/password').post(users.changePassword);
	app.route('/auth/forgot').post(users.forgot);
	app.route('/auth/reset/:token').get(users.validateResetToken);
	app.route('/auth/reset/:token').post(users.reset);

	// Setting up the users authentication api
	app.route('/auth/signup').post(users.signup);
	app.route('/auth/signin').post(users.signin);
	app.route('/auth/signout').get(users.signout);

	// Setting the facebook oauth routes
	app.route('/auth/facebook').get(passport.authenticate('facebook', {scope: ['email']}));
	app.route('/auth/facebook/callback').get(users.oauthCallback('facebook'));
	
	// Setting the SPOTIFY oauth routes
	app.route('/auth/spotify').get(passport.authenticate('spotify', {
		scope: ['user-read-email', 'user-read-private', 'playlist-read-collaborative', 'playlist-modify-public', 'playlist-modify-private'] ,  showDialog: true
	}));
	app.route('/auth/spotify/callback').get(users.oauthCallback('spotify'));
	
	
	//app.route('/connect/spotify').get(passport.authenticate('spotify', {
	//	scope: ['user-read-email', 'user-read-private', 'playlist-read-collaborative', 'playlist-modify-public', 'playlist-modify-private'] 
	//}));
	//app.route('/connect/spotify/callback').get(users.oauthCallback('spotify'));
	



	// Setting the twitter oauth routes
	app.route('/auth/twitter').get(passport.authenticate('twitter'));
	app.route('/auth/twitter/callback').get(users.oauthCallback('twitter'));

	// Setting the google oauth routes
	app.route('/auth/google').get(passport.authenticate('google', {
		scope: [
			'https://www.googleapis.com/auth/userinfo.profile',
			'https://www.googleapis.com/auth/userinfo.email'
		]
	}));
	app.route('/auth/google/callback').get(users.oauthCallback('google'));

	// Setting the linkedin oauth routes
	app.route('/auth/linkedin').get(passport.authenticate('linkedin'));
	app.route('/auth/linkedin/callback').get(users.oauthCallback('linkedin'));

	// Setting the github oauth routes
	app.route('/auth/github').get(passport.authenticate('github'));
	app.route('/auth/github/callback').get(users.oauthCallback('github'));

	// Finish by binding the user middleware
	app.param('userId', users.userByID);
};