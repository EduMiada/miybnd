'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Setlist = mongoose.model('Setlist'),
	_ = require('lodash'),
	request = require('Request');


var SpotifyClientID = '5063d7fc578d4b928e96e050790860c9';
var SpotifyClientSecret = '5063d7fc578d4b928e96e050790860c9';

var SpotifyWebApi = require('spotify-web-api-node');

  
/**
 * Create SPOTIFY Setlist
 */
exports.createSpotifyPlaylist = function(req, res){

	var setlist = req.setlist;
	var setlistId = setlist._id;
	var playlistName = setlist.name;
	var userID = req.user.additionalProvidersData.spotify.id;
	
	//console.log(req.user);
		
	//SPOTIFY CREDENTIALS
	var spotifyApi = new SpotifyWebApi({
		clientId : '5063d7fc578d4b928e96e050790860c9',
	 	clientSecret : 'f6f4758ea04942668385ab0d4953e014',
	  	redirectUri : '/auth/spotify/callback'
	});

	//AUTHORIZATION
   	var authOptions = {
      	url: 'https://accounts.spotify.com/api/token',
      	form: {
        		refresh_token : req.user.additionalProvidersData.spotify.refreshToken, //req.user.providerData.refreshToken,
        		grant_type: 'refresh_token'
      	},
      	headers: {
				 'Authorization': 'Basic ' +  new Buffer('5063d7fc578d4b928e96e050790860c9' + ':' + 'f6f4758ea04942668385ab0d4953e014' ).toString('base64')
      	},
      	json: true
    };
	

	//GET TOKEN AND CREATE PLAYLIST
	request.post(authOptions, function(error, response, body) {
		var accessToken = body.access_token;
		
		spotifyApi.setAccessToken(accessToken);		
		spotifyApi.createPlaylist(userID,  playlistName, { 'public' : false })
			.then(function(data) {
				var playlistID = data.body['id'];

				//update setlist
				Setlist.newSpotifyPlaylist(userID, setlistId, playlistID, function(songs ){
										  
			    // Add tracks to the playlist
			     spotifyApi.addTracksToPlaylist(userID, playlistID, songs)
				 	.then(function(data) {
	    				res.jsonp(setlist);
					});
				});
							
			}, function(err) {
				console.log('Something went wrong!', err);
		});
	});
	
}


/**
 * Update SPOTIFY Setlist
 */
exports.updateSpotifyPlaylist = function(req, res){

	var setlist = req.setlist;
	var setlistId = setlist._id;
	var playlistID = setlist.spotifyPlaylistId;
	var userID = req.user.additionalProvidersData.spotify.id;
				
	//SPOTIFY CREDENTIALS
	var spotifyApi = new SpotifyWebApi({
		clientId : '5063d7fc578d4b928e96e050790860c9',
	 	clientSecret : 'f6f4758ea04942668385ab0d4953e014',
	  	redirectUri : '/auth/spotify/callback'
	});

	//AUTHORIZATION
   	var authOptions = {
      	url: 'https://accounts.spotify.com/api/token',
      	form: {
        		refresh_token : req.user.additionalProvidersData.spotify.refreshToken, //req.user.providerData.refreshToken,
        		grant_type: 'refresh_token'
      	},
      	headers: {
				 'Authorization': 'Basic ' +  new Buffer('5063d7fc578d4b928e96e050790860c9' + ':' + 'f6f4758ea04942668385ab0d4953e014' ).toString('base64')
      	},
      	json: true
    };
	

	//GET TOKEN AND CREATE PLAYLIST
	request.post(authOptions, function(error, response, body) {
		if (error){
			return res.status(400).send({message: errorHandler.getErrorMessage(error)});	
		}else{
		
			var accessToken =  body.access_token;
			
			spotifyApi.setAccessToken(accessToken);		
			Setlist.newSpotifyPlaylist(userID, setlistId, playlistID, function(songs ){										  
			spotifyApi.replaceTracksInPlaylist(userID, playlistID, songs)
				.then(function(data) {
					res.jsonp(setlist);
				});
			});
		}								
	});
	
}


/**
 * Follow SPOTIFY Setlist
 */
exports.followSpotifyPlaylist = function(req, res){

	var setlist = req.setlist;
	var setlistId = setlist._id;
	var playlistID = setlist.spotifyPlaylistId;
	var userID = setlist.spotifyOwnerId;
	
	
	//console.log ('playlist', playlistID);
	
	//SPOTIFY CREDENTIALS
	var spotifyApi = new SpotifyWebApi({
		clientId : '5063d7fc578d4b928e96e050790860c9',
	 	clientSecret : 'f6f4758ea04942668385ab0d4953e014',
	  	redirectUri : 'http://localhost:3000/auth/spotify/callback'
	});

	//AUTHORIZATION
   	var authOptions = {
      	url: 'https://accounts.spotify.com/api/token',
      	form: {
        		refresh_token : req.user.additionalProvidersData.spotify.refreshToken, //req.user.providerData.refreshToken,
        		grant_type: 'refresh_token'
      	},
      	headers: {
				 'Authorization': 'Basic ' +  new Buffer('5063d7fc578d4b928e96e050790860c9' + ':' + 'f6f4758ea04942668385ab0d4953e014' ).toString('base64')
      	},
      	json: true
    };
	

	//GET TOKEN AND CREATE PLAYLIST
	request.post(authOptions, function(error, response, body) {
		var accessToken = body.access_token;
		
		spotifyApi.setAccessToken(accessToken);		
//			.then(function(data) {
				//update setlist
				//Setlist.newSpotifyPlaylist(userID, setlistId, playlistID, function(songs ){										  
			    // Add tracks to the playlist
			    // spotifyApi.replaceTracksInPlaylist(userID, playlistID, songs)
				 //	.then(function(data) {
	    			//	res.jsonp(setlist);
				//	});
					
					
				spotifyApi.followPlaylist(userID, playlistID,{'public' : false})
					.then(function(data) {
						console.log('Playlist successfully followed privately!');
						res.jsonp('ok');
					}, function(err) {
						console.log('Something went wrong!', err);
						res.jsonp(err);
				});
					
				//});
				//			
	//		}, function(err) {
	//			console.log('Something went wrong!', err);
	//	});
	});
	
}


/**
 * Create a Setlist
 */
exports.create = function(req, res) {
	var setlist = new Setlist(req.body);
	setlist.user = req.user;
	setlist.band = req.user.selectedBand;
		
	setlist.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {			
			res.jsonp(setlist);
		}
	});
};

/**
 * Show the current Setlist
 */
exports.read = function(req, res) {
	res.jsonp(req.setlist);
};

/**
 * Update a Setlist
 */
exports.update = function(req, res) {
	var setlist = req.setlist ;

	setlist = _.extend(setlist , req.body);

	setlist.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(setlist);
		}
	});
};

/**
 * Delete an Setlist
 */
exports.delete = function(req, res) {
	var setlist = req.setlist ;

	setlist.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(setlist);
		}
	});
};

/**
 * List of Setlists
 */
exports.list = function(req, res) { 
	Setlist.find({band:req.user.selectedBand}).sort('-created').populate('user', 'displayName').exec(function(err, setlists) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(setlists);
		}
	});
};

/**
 * Setlist middleware
 */
exports.setlistByID = function(req, res, next, id) { 

	Setlist.findById(id, function (err, setlist) {
	  var opts = [
	      	 { path: 'user', select: 'displayName' },
	    	 { path: 'songs.song',  model: 'Song'} ];
	
	Setlist.populate(setlist, opts, function (err, setlist) {
		if (err) return next(err);
		if (! setlist) return next(new Error('Failed to load Setlist ' + id));
		
		req.setlist = setlist ;
		next();
    
	  });
	});	
};

/**
 * Setlist authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	//if (req.setlist.user.id !== req.user.id) {
//		return res.status(403).send('User is not authorized');/
//	}
	next();
};
