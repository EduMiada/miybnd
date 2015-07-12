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
		_id:{type: Schema.ObjectId, unique:true}, 
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
	}
});

mongoose.model('Setlist', SetlistSchema);