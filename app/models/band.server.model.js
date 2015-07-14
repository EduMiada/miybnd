'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Band Schema
 */
var BandSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Band name',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	members: [{
		admin: Number,
		member:{
			type: Schema.ObjectId,
			ref: 'User'
		}	
	}],
	
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Band', BandSchema);