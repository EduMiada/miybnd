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


/*
LOAD THE USERS BANDS
*/
BandSchema.statics.userBands = function(userID, selectedBandID, callback) {


	var _this = this
	var userObjectID = mongoose.Types.ObjectId(userID);
	var arrBands= [];
		
	//console.log(userID);
	
	_this.find({'members.member': userObjectID}).select('_id, name').exec(function(err, bands) {
		
		if (err) {
				console.log(err);
		} else {
		   for (var i = 0; i < bands.length; i++) {
				var selected = false;
				if (bands[i]._id === selectedBandID){
					selected = true;
				}
				
				var item = {
				  '_id':bands[i]._id, 
				  'selected':selected,
				  'name': bands[i].name
				};
  
		          arrBands.push(item);
		      }
			
			
			callback(arrBands);
			
		}
				
	});
};




mongoose.model('Band', BandSchema);