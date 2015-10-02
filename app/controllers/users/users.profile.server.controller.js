'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
	errorHandler = require('../errors.server.controller.js'),
	mongoose = require('mongoose'),
	passport = require('passport'),
	User = mongoose.model('User'),
	Band = mongoose.model('Band'),
	jwt    = require('jsonwebtoken'), // used to create, sign, and verify tokens
	config = require('../../../config/config');


/**
 * list user bands
 */
exports.listBands = function(req, res) {
	// Init Variables
	var userID = req.user._id;
	var selectedBandID = req.user.selectedBand._id;
	//res.json({user:userID, band:selectedBandID});
	///console.log('userID', userID);
	//console.log('SelectedBand', selectedBandID);

	//console.log('USer', req.user);

	
	Band.userBands(userID, selectedBandID, function (bands){
		res.json(bands);
	}) ;
	
};

/**
 * list user bands
 */
exports.setCurrentBand = function(req, res) {
	// Init Variables
	var newCurrentBandID = req.body.newCurrentBand;
	
	User.setCurrentBand(req.user._id, newCurrentBandID, function(updated){
		if (updated){
				User.findById(req.user._id).populate('selectedBand','name').exec(function(err, user) {
				if (err) {					
					res.status(400).send(err);
				}else {
					user.password = undefined;
					user.salt = undefined;	
					
					// create a token
					var token = jwt.sign(user, config.secret, {
						expiresInMinutes: 1440 // expires in 24 hours
					});
			
					var userID = user._id;
					var selectedBandID = user.selectedBand._id;
					
					Band.userBands(userID, selectedBandID, function (bands){
						user.bands = [];
						user.bands = bands;

						res.json({
							success: true,
							token: token,
							data: user
						});	
		
					}); //end userband
					
				} //end if
			}); //find user
		}//end if updated
	}); //end setcurrentband	
};



/**
 * Update user details
 */
exports.update = function(req, res) {
	// Init Variables
	var user = req.user;
	var message = null;
	var selectedBandID = null;
	
	//console.log(user);
	
	try{
		selectedBandID = req.body.selectedBand._id ;
	}catch(err){
		//console.log('no band selected');
	}
	
	// For security measurement we remove the roles from the req.body object
	delete req.body.roles;
	delete req.body.selectedBand;
	delete req.body.password;
	delete req.body.salt;
	

	if (user) {
		// Merge existing user
		user = _.extend(user, req.body);
		user.updated = Date.now();
		user.displayName = user.firstName + ' ' + user.lastName;
		user.selectedBand = selectedBandID;
		
		
		console.log(user);

		user.save(function(err) {
			if (err) {
				console.log(err);
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
					
				});
			} else {
				req.login(user, function(err) {
					if (err) {
						res.status(400).send(err);
					} else {
						
						
						User.findOne({_id: user._id}).populate('selectedBand','name').exec(function(err, user) {
							if (err) {
								
								res.status(400).send(err);
							}else {
								res.json(user);		
								
							}
						});
					}
				});
			}
		});
	} else {
		res.status(400).send({
			message: 'User is not signed in'
		});
	}
};


/**
 * list user bands
 */
exports.userBands = function(req, res) {
	// Init Variables
	//var userID = req.user._id;
	var userID = req.profile._id;
	var selectedBandID = undefined;
	
	if(req.profile.selectedBand){
	 	selectedBandID = req.profile.selectedBand._id;
	}
	
	Band.userBands(userID, selectedBandID, function (bands){
		//console.log(bands);
		res.json(bands);
	}) ;
	
};


/**
 * Send User
 */
exports.me = function(req, res) {
	res.json(req.user || null);
};