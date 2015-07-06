'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Song = mongoose.model('Song'),
	_ = require('lodash'),
	async = require('async'),
	request = require('request'),
	htmlparser = require('htmlparser2');

/**
 * Create a Song
 */
exports.create = function(req, res) {
	var song = new Song(req.body);
	song.user = req.user;

	//levar esse codigo para o pre save do modelo testar
	//var defaultImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAAAAABVicqIAAAA50lEQVR4Ae3XzWqAMBAE4L7/o0Vjig0aKjWJP5UG9x3KNuClkFMWtJ05Lc7hEyO4vpB8CAgQIED+OgIECBAgQIAAia4YXwVxqpgByC+k1D8NKb9jWx2kfDL+LgiQpn9vRREzzJ8n0asU0tppTbkUQ8yZiyO4XQyxRGmZ3vg0VkEk5EEW8UD+NaI7cUQv3AojG4khfYjhB//;+lzawQQRxxGbG7b+og+L6T54mlVtZHr9j94NjGlqAUQky9Z2c/vxM9rVtURXusuRHXj2Kk6SHntvgcCZPelHE/5xQYCBAgQIECAAAECBAiQbzpypdZZxuxBAAAAAElFTkSuQmCC';

	//if (!song.song_image){
	//	song.song_image = defaultImage;
	//}


	//verifica se a musica ja existe na base
	Song.find({ name :  { $regex : new RegExp( song.name, 'i') }} ).sort('-created').exec(function(err, sng) {
		if (!sng.length){	
			song.save(function(err) {
				if (err) {
					return res.status(400).send({
						message: errorHandler.getErrorMessage(err)
					});
				} else {
					res.jsonp(sng);
				}
			});
			
		}else{
			return res.status(409).send({message: 'Song already exists'});
		}
	});
};





/**
 * Show the current Song
 */
exports.read = function(req, res) {
	res.jsonp(req.song);
};

/**
 * Update a Song
 */
exports.update = function(req, res) {
	var song = req.song ;

	song = _.extend(song , req.body);

	song.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(song);
		}
	});
};

/**
 * Delete an Song
 */
exports.delete = function(req, res) {
	var song = req.song ;

	song.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(song);
		}
	});
};

/**
 * List of Songs
 */
exports.list = function(req, res) { 
	var filterType =  Number(req.query.filterType);
	var filter =['New','Work in Process', 'Ready to Rock!'];

	if (filterType === 2){
		filter =['Unrated'];		
	}

	if (filterType === 3){
		filter =['Backlog'];		
	}

	console.log(filter);
	Song.find({ 'song_status': { $in: filter} } ).sort('-created')
				.populate('user', 'displayName')
		//		.aggregate([
		//			
		//		])
				.exec(function(err, song) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(song);
		}
	});
	
	
	/*
	 db.AccountModel.aggregate([
        { $match: {
            _id: accountId
        }},
        { $unwind: "$records" },
        { $group: {
            _id: "$_id",
            balance: { $sum: "$records.amount"  }
        }}
    ], function (err, result) {
        if (err) {
            console.log(err);
            return;
        }
        console.log(result);
    });*/

};

/**
 * Song middleware
 */
exports.songByID = function(req, res, next, id) { 
	Song.findById(id).populate('user', 'displayName').exec(function(err, song) {
		if (err) return next(err);
		if (! song) return next(new Error('Failed to load Song ' + id));
		req.song = song ;
		next();
	});
};

/**
 * Song authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.song.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};

exports.queryMusixMatch = function(req, res, next){

	var list = [];

	var track_name = req.query.music
		.toLowerCase()
    	.replace(/ /g, '%20');


    var url = 'http://api.musixmatch.com/ws/1.1/track.search?apikey=937dd267ce7fecd3922af964be92cc3c';
    	url = url + '&q=' + track_name + '&f_has_lyrics=1';


	async.waterfall([
	    function(callback) {
	     	request.get(url, function(error, response, body) {

	        if (error) return next(error);
	        
			var jsonObject = JSON.parse(body);
			var tracks = jsonObject.message.body.track_list;

	        if (!tracks.length) {
	            res.status(409).send({message: 'track not found.' });
	         }

	        //se tiver retorno faz loop e retorna json senao retorna mensagem
	        if (tracks.length){
				for(var track in tracks) {
				   //console.log('key: ' + tracks[track].album_coverart_350x350);
					list.push({
				   		'track_id': tracks[track].track.track_id,
				   		'track_name': tracks[track].track.track_name,
				   		'artist_name': tracks[track].track.artist_name,
				   		'album_name': tracks[track].track.album_name,
				   		'album_coverart': tracks[track].album_coverart_100x100
					});

					//console.log(tracks[track].album_coverart_100x100);
				}
				//console.log(tracks.length);
		    	res.send(list);
	        }
	    });
	}], 
	   function(err, msg) {
	          res.status.send(409, { message: ' already exists.' });
	    }
	);
};


exports.getMusixMatchFromID = function(req, res, next, id){
//console.log('get from id' + id);
 async.waterfall([
    function(callback) {
      request.get('http://api.musixmatch.com/ws/1.1/track.get?apikey=937dd267ce7fecd3922af964be92cc3c&track_id=' + id + '&format=json', function(error, response, body) {

        var jsonObject = JSON.parse(body);
	    var track = jsonObject.message.body.track;
		
//		console.log(track);

		callback(error, track);
        });
    },
  	function(track, callback) {
      var url = track.album_coverart_100x100;
      request({ url: url, encoding: null }, function(error, response, body) {
        track.track_image = 'data:' + response.headers['content-type'] + ';base64,' + body.toString('base64');
        callback(error, track);
      });

    },
    function(track, callback) {
    	//var url = 'http://api.musixmatch.com/ws/1.1/track.lyrics.get?apikey=937dd267ce7fecd3922af964be92cc3c&track_id=' + id + '&format=json';
    	var url= track.track_share_url; //'https://www.musixmatch.com/pt-br/letras/Pearl-Jam/Alive'
		var track_lyrics = 'No lyrics';

		//console.log('url-----------------------------');
		//console.log(url);

  		request.get(url, function(error, response, body) {
        //if (error) return next


		//console.log('body-----------------------------');
		//console.log(body);

		var htmlparser = require('htmlparser2');
		var parser = new htmlparser.Parser({
		    onopentag: function(name, attribs){
		        if(name === 'script'){ //&& attribs.type === "text/javascript"){
		  //         console.log('JS! Hooray!' + JSON.stringify(attribs));
		        }
		    },
		    ontext: function(text){
		    	if(text.indexOf('var __mxmProps') > -1) {
		    		var istart = text.indexOf('lyrics_body') + 14;
		    		var iend = text.indexOf('lyrics_language') - 3; 
		        	track_lyrics = text.substr(istart, iend - istart);
  //req.lyrics_body = track_lyrics;

					var arrLyrics = track_lyrics.split('\\n');	
					var arr = '';
					for(var i = 0; i < arrLyrics.length; i++) {
						if (!arrLyrics[i].length){
							arr =  arr  + '<span class="lyricLineSpace">' + arrLyrics[i] + '</span>\r\n';
						}else{
						 	arr =  arr  + '<span class="lyricLine">' + arrLyrics[i] + '</span>\r\n';
						}
					}

					track_lyrics = arr;

		        }
		    },
		    onclosetag: function(tagname){
		        //if(tagname === 'script'){
		         //   console.log("That's it?!");
		        //}
		    }
		}, {decodeEntities: true});
		parser.write(body);
		parser.end();

	  
        callback(error, track, track_lyrics);
      });

      //next();
    }

   ], 
   function(err, track, lyrics) {
   		if (err) return next(err);   		
        req.track = track;
        req.lyrics_body = lyrics;


   		next();
      //res.send(200);
    });
};

exports.createFromMusixMatch = function(req, res, next){

	var status = req.query.status;
	var track = req.track ;
	
	track = _.extend(track , req.body);

	//verifica se a musica ja existe na base
	Song.find({ name : track.track_name} ).sort('-created').exec(function(err, sng) {
		if (!sng.length){
			
			var song = new Song({
				name: track.track_name,
				artist: track.artist_name,
				user  : req.user,
				spotify_id : track.track_spotify_id,
				musixmatch_id : track.track_id,
				source_name : 'MUSIXMATCH',
				external_rating: track.track_rating,
				length: track.track_length,
				external_url: track.track_share_url,
				song_image: track.track_image,
				lyrics: req.lyrics_body,
				song_status: status
			});

			//console.log(music);

			song.save(function(err) {
				if (err) {
					res.status(400).send({
						message: errorHandler.getErrorMessage(err)
					});
				} else {
					res.jsonp(song);
				}
			});

			
		}else{
			res.status(409).send({message: 'Song already exists'});
		}
	});

};




/*--------------------------------------------------------
  Rate and unrated related code
--------------------------------------------------------- */

//list all songs not rated by the current user
exports.listUnrated = function(req, res) { 
	
	// Find a unique available username
	Song.getSongStatusList(function(availableUsername) {
	// Set the available user name 
		console.log( availableUsername);
	});
		
	
	Song.find({ song_status : 'Unrated', 'user_rate._id' : { $ne: req.user._id}  } ).sort('-created').populate('user', 'displayName').exec(function(err, song) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(song);
		}
	});
};

//rate the song and return a list of unrated songs
exports.rateSong = function(req, res) { 

	var song = req.song ;
	var rate =  Number(req.query.rateNumber);
	
	
	console.log(song);
	
	//if rate == 1 hell no change status to backlog
	if(rate === -1){
		song.song_status = 'Backlog';
	}

	song.user_rate.push({_id:req.user._id ,user:req.user._id, rate:rate}) ;
		
	//get the number of rates if equals the band number of members change the status if not rate zero backlog
	if (song.user_rate.length ===  4){
		if (rate > 0){
			song.song_status = 'New';
		}
	}

	song.save(function(err) {
		if (err) {
			return res.status(400).send({message: errorHandler.getErrorMessage(err)});
		} 
		else {
			Song.find({ song_status : 'Unrated', 'user_rate._id' : { $ne: req.user._id}  } ).sort('-created').populate('user', 'displayName').exec(function(err, song) {
			//Music.find({ status : 'Unrated' } ).sort('-created').populate('user', 'displayName').exec(function(err, music) {
				if (err) {
					return res.status(400).send({
						message: errorHandler.getErrorMessage(err)
					});
				} else {
					res.jsonp(song);
				}
			});
		}
	});
};
