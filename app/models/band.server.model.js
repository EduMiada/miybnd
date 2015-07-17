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


BandSchema.statics.getMembers = function(bandID, callback) {
	var _this = this;
	
	_this.findOne({_id: bandID}, function(err, band) {		
		if (band) {
			console.log(band.members.length)
			callback (err, band.members);
		}else {
			return null;
		}
	});
};



mongoose.model('Band', BandSchema);