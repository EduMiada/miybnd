//'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;
	//Song = mongoose.model('Song');
	
/**
 * Setlist Schema
 */
var SetlistSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Setlist name',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	
	songs: [{
		order: Number,
		song:{
			type: Schema.ObjectId,
			ref: 'Song'
		}
	}],
	
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	band: {
		type: Schema.ObjectId,
		ref: 'Band'
	},
	
	spotifyPlaylistId:{
		type: String
	},
	
	spotifyOwnerId:{
		type: String
	},
	
	spotifyLastUpdate:{
		type: Date
	},
	
	duration:{
		type: Number,
		default: 0
	}
});

/**
 * Hook a pre save method to save the setlist duration
 */
SetlistSchema.pre('save', function(next) {
	var _this = this;
	var Song = mongoose.model('Song');
	var songsId = [];

	//if there are no songs returs
	if(!_this.songs.length){
		_this.duration = 0;
		next();
	}else{
	//get the songs array
		for (var i = 0; i < _this.songs.length; i++) {
			if (_this.songs[i].song._id){
				songsId.push(_this.songs[i].song._id);	
			}else{
				songsId.push(_this.songs[i].song);
			}
			
		}//end loop
	
			//aggregate total duration
		Song.aggregate()
			.project({length: 1})
			.match({'_id': { '$in': songsId }})
			.group({'_id': '1', 'duration': {'$sum':'$length'}})
			.exec(function(err, result) {
				if (err){
					console.log('error', err);
				}else{
					_this.duration = result[0].duration;				
				}
		
			next();		
		
		}); //end aggregate
	}//end if
	
});

/*
New and update SPOTIFY ID and return songs to add
*/
SetlistSchema.statics.newSpotifyPlaylist = function(userID, setlistID, playlistID, callback) {

	var _this = this
	var arrSongs= [];
	
	
	//get the setlist and songs
	_this.findById(setlistID)
		.populate({ path: 'songs.song', select: 'spotify_id' } )
		.exec(function (err, setlist) 			{
			//if find the setlist update the playlistID and get songs array
			if(setlist){				
				
				//console.log('owner id', setlist.spotifyOwnerId);
				if(!setlist.spotifyOwnerId)	{
					//console.log('aqui ');
					setlist.spotifyOwnerId = userID;
				}
		
				setlist.spotifyPlaylistId = playlistID;			
				setlist.spotifyLastUpdate = Date.now();
				
				setlist.save(function(err) {
					if (err) {
						console.log('setlist:newSpotify:Error', err)
						callback(err, null)
					} else {			
						
						//get song arrays
						for (var i = 0; i < setlist.songs.length; i++) {				
							if (setlist.songs[i].song.spotify_id){
								arrSongs.push('spotify:track:' + setlist.songs[i].song.spotify_id);
							}
					    }
						//callack
						callback(arrSongs);												
						
					}
				}); //save
			} //if setlis
		}); //find exec
};


mongoose.model('Setlist', SetlistSchema);