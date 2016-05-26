'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Band = mongoose.model('Band'),
	User = mongoose.model('User'),
	_ = require('lodash');

/*API*/

//get band API
exports.getBand = function(req, res) {
    if (req.band){
        Band.findById(req.band._id, function (err, band) {
        var opts = [
                { path: 'user', select: 'displayName' },
                { path: 'members.member', model: 'User', select:'_id displayName pictureSmall'} ];
        
            Band.populate(band, opts, function (err, band) {
                if (err) return  res.status(401).send({message: err});;
                if (! band) return res.status(401).send({message: 'Failed to load Band ' + req.band._id});
                res.json({success: true, data: band}) ;
            });
        });        
        
    }else{
        return res.status(401).send({message: 'Failed to load Band '});
    }

};

/**
 * Create a Band
 */
exports.create = function(req, res) {
	var band = new Band(req.body);
	band.user =  mongoose.Types.ObjectId(req.user._id); 
	band.members.push({'admin': 1, member: band.user });

	band.save(function(err) {
		if (err) {
			return res.status(400).send({message: err});
		} else {
			res.jsonp({success: true, data: band});
		}
	});
};

/**
 * Show the current Band
 */
exports.read = function(req, res) {
	res.jsonp(req.band);
};

/**
 * Update a Band
 */
exports.update = function(req, res) {
	var band = req.band ;

	band = _.extend(band , req.body);

	band.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp( {success: true, data: band});
		}
	});
};

/**
 * Delete an Band
 */
exports.delete = function(req, res) {
	var band = req.band ;

	band.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(band);
		}
	});
};

/**
 * List of Bands user is member or admin
 */
exports.list = function(req, res) { 
    
    var userObjectID = mongoose.Types.ObjectId(req.user._id);

	Band.find().or([{'members.member':userObjectID}, {'user':userObjectID}]).sort('-created').populate('user', 'displayName').exec(function(err, bands) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(bands);
		}
	});
};


/**
 * Band middleware
 */
exports.bandByID = function(req, res, next, id) { 

	Band.findById(id, function (err, band) {
	 var opts = [
	      	 { path: 'user', select: 'displayName' },
	    	 { path: 'members.member',  model: 'User'} ];
	
	Band.populate(band, opts, function (err, band) {
		if (err) return next(err);
		if (! band) return next(new Error('Failed to load Band ' + id));
	//	console.log(band);
		
		req.band = band ;
		next();
    
	  });
	});
};


exports.seachNewMembers = function(req, res, next){
	var searchParam = new RegExp(req.params.search, 'i');
//app.User.find()exec(function(err, users) {
//    res.json(JSON.stringify(users));
//});
	User.find().or([{ 'displayName': { $regex: searchParam }}, 
					{ 'username': { $regex: searchParam }}]).sort('displayName').exec(function(err, users){
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.send(users);
		}
	});

};


/**
 * Band authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
//	if (req.band.user.id !== req.user.id) {/
//		return res.status(403).send('User is not authorized');
//	}
	next();
};
