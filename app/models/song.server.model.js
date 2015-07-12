'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
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