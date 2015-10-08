'use strict';

module.exports = function(app) {
	var feeds = require('../../app/controllers/feeds.server.controller');
	var users = require('../../app/controllers/users.server.controller');
	var songs = require('../../app/controllers/songs.server.controller');
	var bands = require('../../app/controllers/bands.server.controller');

	app.route('/v1/api/:bandId/feeds')	
		.get(users.checkToken_API, feeds.getUserFeeds);
	
	app.route('/v1/api/:bandId/feeds/:feedId/comments')	
		.post(users.checkToken_API, feeds.addFeedComments);	

	// Finish by binding the Song middleware
	app.param('bandId', bands.bandByID);
	app.param('songId', songs.songByID);
	app.param('feedId', feeds.feedItemByID);
};
