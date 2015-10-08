'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Band = mongoose.model('Band'),
	FeedItem = mongoose.model('FeedItem'),
	Schema = mongoose.Schema;

/**
 * Song Schema
 */
var SongSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Song name',
		trim: true
	},
	
	artist: {
		type: String,
		default: '',
		trim: true
	},
	key: {
		type: String,
		default: '',
		trim: true
	},	
	bpm: {
		type: Number,
		default: 120
	},	
	style: {
		type: String,
		default:''
	},	
	lyrics: {
		type: String,
		default:''
	},	
	tablature: {
		type: String,
		default:''
	},	
	external_rating: {
		type: Number,
		default:0
	},	
	length: {
		type: Number,
		default:0
	},
	external_url: {
		type: String,
		default:''
	},
	source_name: {
		type: String,
		default: '',
		trim: true
	},	
	musixmatch_id: {
		type: String,
		default: '',
		trim: true
	},
	spotify_id: {
		type: String,
		default: '',
		trim: true
	},
	youtube_id: {
		type: String,
		default: '',
		trim: true
	},
	song_image: {
		type: String
	},
	
	song_image_350: {
		type: String
	},

	song_image_500: {
		type: String
	},

	song_status: {type: String,
			enum: ['Unrated', 'Backlog','New','Work in Process', 'Ready to Rock!'],
			default: 'Unrated'
	},
	user_rate: [{
		user: {	
			type: Schema.ObjectId,
			ref: 'User'
		}, 
		rate: Number
	}],
	
	song_rate: {type:Number, default: 0},

	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	band: {
		type: Schema.ObjectId,
		ref: 'Band'
	}
});



SongSchema.statics.addUserRate = function(songID, userID, songRate, callback) {
	var _this = this;
	var status = '';
	var rateChanged = false;
	var calculatedRate = 0;

	//if rate == 1 hell no change status to backlog
	if(songRate === -1){
		status = 'Backlog';
	}
	
	
	//console.log('songs status: ' + status + ' songID:' + songID + ' userID: ' + userID + ' songRate: ' + songRate);
	
	//get the song check if the user already have created, if so update or create a new
	_this.findById(songID).exec(function(err, song) {     //populate('user', 'displayName').exec(function(err, song) {
		if (song) {
			
			//console.log('find Ok')
			
			//user already rated so update and keep the status
			for (var i = 0; i < song.user_rate.length; i++) {
				if (song.user_rate[i].user === userID){
					song.user_rate[i].rate = songRate;
					rateChanged = true;
				}	
				
				calculatedRate += song.user_rate[i].rate;
			} //loop

		
			//add the user rate to the song and update status if needed			
			if (!rateChanged){
				song.user_rate.push({_id: userID, user:userID, rate: songRate}) ;
				
				calculatedRate += songRate; 

				//console.log('calculated rate:' + calculatedRate);
				//console.log('push ok ' );
				//console.log(song);
		
				song.song_rate = (calculatedRate / song.user_rate.length);
		
				//get the number of band members
				Band.getMembers(song.band, function (err, members){
					var numMembers = members.length;
					
					//console.log('members:' + numMembers);
					
					//get the number of rates if equals the band number of members change the status if not rate zero (backlog)
					if (song.user_rate.length ===  numMembers){
						if (songRate > 0){
							status  = 'New';
						}
					}
					
					if (status !==  ''){
						song.song_status = status;
					}				
	
					song.save(function(err) {
						if (err) {
							callback(err, null);
							//console.log('save err ' + err);
						} 
						else {
							//add a new song feed				
							FeedItem.addSongFeed(song, userID, function(err, item) {	
								if (err) {
									console.log('SONG FEED ITEM ERROR:', err)
									//return res.status(400).send({message: errorHandler.getErrorMessage(err)});
								} 
								else {
									console.log('SONG FEED ITEM SUCCESS')
								}
							}); //FEED ITEM NEW  callback
												
							callback(null, song);
						}
					}); //song.save callback
				}); //band get member callback
			} //rate changed if
		}else{
			callback (err,null);
			//console.log('erro find')
			
		}
	}); //findbyId callback
}; //end function



// Get list of valid status
// Create an instance method for authenticating user
SongSchema.statics.getSongStatusList = function(callback) {
	callback ( ['Unrated', 'Backlog','New','Work in Process', 'Ready to Rock!']);
};


// Use a pre-save middleware to add an image if not provided
SongSchema.pre('save', function(next) {
	if (!this.song_image) {		
		this.song_image = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAAAAABVicqIAAAA50lEQVR4Ae3XzWqAMBAE4L7/o0Vjig0aKjWJP5UG9x3KNuClkFMWtJ05Lc7hEyO4vpB8CAgQIED+OgIECBAgQIAAia4YXwVxqpgByC+k1D8NKb9jWx2kfDL+LgiQpn9vRREzzJ8n0asU0tppTbkUQ8yZiyO4XQyxRGmZ3vg0VkEk5EEW8UD+NaI7cUQv3AojG4khfYjhB+lzawQQRxxGbG7b+og+L6T54mlVtZHr9j94NjGlqAUQky9Z2c/vxM9rVtURXusuRHXj2Kk6SHntvgcCZPelHE/5xQYCBAgQIECAAAECBAiQbzpypdZZxuxBAAAAAElFTkSuQmCC';

	}

	next();
});

// Configure  to use getters and virtuals when transforming to JSON
SongSchema.set('toJSON', {
	getters: true,
	virtuals: true
});

mongoose.model('Song', SongSchema);