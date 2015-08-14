'use strict';

/**
 * Module dependencies.
 */
var passport = require('passport'),
	url = require('url'),
	//FacebookStrategy = require('passport-facebook').Strategy,
	SpotifyStrategy = require('passport-spotify').Strategy,
	config = require('../config'),
	users = require('../../app/controllers/users.server.controller');

module.exports = function() {
	
	
	// Use facebook strategy
	passport.use(new SpotifyStrategy({
			clientID: config.spotify.clientID,
			clientSecret: config.spotify.clientSecret,
			callbackURL: config.spotify.callbackURL,
			passReqToCallback: true
		},
		function(req, accessToken, refreshToken, profile, done) {
			// Set the provider data and include tokens
			
			var providerData = profile._json;
			providerData.accessToken = accessToken;
			providerData.refreshToken = refreshToken;

			// Create the user OAuth profile
			var providerUserProfile = {
				firstName: profile.displayName,
				//lastName: profile.name.familyName,
				displayName: profile.displayName,
				email: profile.emails[0].value,
				username: profile.username,
				provider: 'spotify',
				providerIdentifierField: 'id',
				providerData: providerData,
				code:req.query.code
			};

			// Save the user OAuth profile
			users.saveOAuthUserProfile(req, providerUserProfile, done);

		}
	));
};