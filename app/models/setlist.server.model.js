'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

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
	}
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
							arrSongs.push('spotify:track:' + setlist.songs[i].song.spotify_id);
					    }
						//callack
						callback(arrSongs);												
						
					}
				}); //save
			} //if setlis
		}); //find exec
};


mongoose.model('Setlist', SetlistSchema);