'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	UserFeed = mongoose.model('UserFeed'),
	FeedItem = mongoose.model('FeedItem'),
	FeedComment = mongoose.model('FeedComment');

var ObjectId = mongoose.Types.ObjectId; 

/*
FEED API METHODS
*/

String.prototype.toObjectId = function() {
  //var ObjectId = (require('mongoose').Types.ObjectId);
  return new ObjectId(this.toString());
};

// Every String can be casted in ObjectId now
//console.log('545f489dea12346454ae793b'.toObjectId());


exports.getUserFeeds = function(req, res) { 

	UserFeed.find({'userID': new ObjectId(req.user._id), bandID: req.band._id })
			.lean()
			.populate('feedItemID', '_id itemStatus link description title summary summary_2 title publisherID itemID itemType publisherID publishedDate')
			.exec(function(err, docs) {
		
				if (err) {
					return res.status(400).send({message: errorHandler.getErrorMessage(err)});
				}else{
					//populate publisher data
					var opts = {
						path: 'feedItemID.publisherID',
						model: 'User' ,
						select: '_id displayName avatar'
					}
					UserFeed.populate(docs, opts, function (err, feeds) {
					if (err) {
						console.log('FEED ERRO:', err.message);
						return res.status(400).send({
							message: errorHandler.getErrorMessage(err)
							
						});
					} else {
						//console.log(  {_id: feedItens._id , read: feedItens.read , data: feedItens.feedItemID });
						//console.log(feedItens);
						
						res.jsonp(feeds);
					}
							
				})
				
			}

    });



	/*UserFeed.find({ 'userID': new ObjectId(req.user._id), bandID: req.band._id } )
				.populate('feedItemID', '_id itemStatus image link description summary summary_2 title itemID itemType publisherID bandID itemDuration itemQuantity itemScore publishedDate state itemScore')
				.populate('feedItemID.publisherID', '_id name')
				.exec(function(err, feedItens) {
		if (err) {
			console.log('FEED ERRO:', err.message);
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
				
			});
		} else {
			//console.log(  {_id: feedItens._id , read: feedItens.read , data: feedItens.feedItemID });
			//console.log(feedItens);
			
			res.jsonp(feedItens);
		}
	});
	*/
};



exports.addFeedComments = function(req, res) { 
	
	FeedComment.addFeedComment(req.user._id, req.FeedItem._id, req.body.comments, function(err, comments) {
		if (err) {
			console.log('FEED COMMENT ERR:', err.message);
			return res.status(400).send({message: errorHandler.getErrorMessage(err)});
		} else {
			res.jsonp(comments);
		}
		
	});
};

exports.feedItemByID = function(req, res, next, id) { 

	FeedItem.findById(id, function (err, feed) {
		if (err) return next(err);
		if (! feed) return next(new Error('Failed to load feed item ' + id));
		
		req.FeedItem = feed ;
		next();
    
	  });
};
