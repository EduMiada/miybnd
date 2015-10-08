'use strict';

/**
 * Module dependencies.
*/
var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	Band = mongoose.model('Band');
	

var ObjectId = mongoose.Types.ObjectId; 

/*convert string to lower case*/
function toLower (v) {
  return v.toLowerCase();
}


/**
 * FeedItem Schema
 */
var FeedItemSchema = new Schema({
	bandID: { type: Schema.ObjectId },
	publisherID: { type: Schema.ObjectId, ref: 'User' },
	itemType: {type: String, trim:true},
	itemID: { type: String, trim:true },
	title: { type: String, trim:true },
	summary: { type: String, trim:true },	
	summary_2: { type: String, trim:true },	
	description: { type: String, trim:true },
	image:  {type: String},
	link: { type: String, trim:true  },
	state: { type: String, trim:true, lowercase:true, default: 'new' },
	publishedDate: { type: Date, default: Date.now },
	created: { type: Date, default: Date.now },
	updated: { type: Date, default: Date.now },
	
	//specific fields
	itemStatus: { type: String, trim:true  }, //song, repertoire
	itemScore: { type: Number, default:0  },
	itemQuantity:{ type: Number, default:0  }, //repertoire
	itemDuration:{ type: Number, default:0  }, //repertoire
	
});
	
	
	
FeedItemSchema.statics.addSongFeed = function(song, user, callback) {
	
	var itemType = 'song_add';
	var title = 'Added new song';
	var description = 'Song added to the repertoire';
	var publisher = undefined;
	
	if (song.song_status === 'Backlog' || song.song_status === 'New'){
		
		publisher = song.user;
		
		if(song.song_status==='Backlog'){
			publisher = user;	
			itemType = 'song_reject';
			title = 'Rejected song';
			description = 'Song placed in to the backlog';
		}

		var _this = new this();
		
		console.log(song.user);
		
		_this.bandID = song.band;
		_this.publisherID = publisher;		
		_this.itemType = itemType;
		_this.itemID = song._id;
		_this.title = title;
		_this.summary = song.name;	
		_this.summary_2 = song.artist;
		_this.description = description ;
		_this.link = '/songs';
		//_this.image = song.song_image;
		//specific fields
		//_this.itemStatus = song.song_status; 
		_this.itemScore = song.song_rate;
		
		//console.log('artist', song.artist);
		
		
		//console.log(_this);
		
		_this.save(function(err) {
			if (err) {
				callback(err, null);
				console.log('feed item save error ' + err);
			}	 
			else {
				
				var UserFeed = mongoose.model('UserFeed');
				//FEED CREATED ADD ITEM TO BAND MEMBERS
				Band.getMembers(song.band, function (err, members){
				
					//loop members
					for (var i = 0; i < members.length; i++) {
						UserFeed.addUserFeed(members[i].member, _this._id, _this.bandID, function(results){
							//console.log('user feed added:', results);
						} );
					}
				
				}); //band get member callback
								
				//console.log('feed item saved successfully');
				callback(null, true);
			}
		}); //item.save callback	
	}else {
		callback(null, false);	
	}
		//end if song
	
	
};

FeedItemSchema.index({entryID : 1});
FeedItemSchema.index({bandID : 1});


mongoose.model('FeedItem', FeedItemSchema);

/*FEED COMMENTS */
var feedCommentSchema = new Schema({
	feedItem: { type: Schema.ObjectId, ref: 'FeedItem' },
	authorID: { type: Schema.ObjectId, ref: 'User' },	
	publishedDate: { type: Date, default: Date.now },
	comment: {type: String, trim:true }
});

	
feedCommentSchema.statics.addFeedComment = function(userID, feedItemID, comment, callback) {
	var _this = new this();
	
	_this.authorID = userID;
	_this.feedItem = feedItemID;
	_this.comment = comment;
	
	_this.save(function(err) {
		if (err) {
			callback(err,false);
			console.log('feed comment save error ' + err);
		}	 
		else {
			callback(null, _this);
			console.log('feed comment saved successfully' );
		}
	});
};			


feedCommentSchema.index({feedItem : 1});
feedCommentSchema.index({authorID : 1});

mongoose.model('FeedComment', feedCommentSchema);







/*USER x FEED ITEM*/
var UserFeedSchema = new mongoose.Schema({

	userID: { type: Schema.ObjectId },
	feedItemID: { type: Schema.ObjectId, ref: 'FeedItem' },
	bandID: { type: Schema.ObjectId },
	read : { type: Boolean, default: false }

});
	
	
	
	
UserFeedSchema.statics.addUserFeed = function(userID, feedItemID, bandID, callback) {
	var _this = new this();
	
	_this.userID = userID;
	_this.feedItemID = feedItemID;
	_this.bandID = bandID;
	
	_this.save(function(err) {
		if (err) {
			callback(false);
			console.log('user feed item save error ' + err);
		}	 
		else {
			callback(true);
			console.log('user feed item saved ' );
		}
	});
};			
	 
mongoose.model('UserFeed', UserFeedSchema);
