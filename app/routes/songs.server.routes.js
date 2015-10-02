'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var songs = require('../../app/controllers/songs.server.controller');
	var bands = require('../../app/controllers/bands.server.controller');

	app.route('/v1/api/songs')
		.get(songs.list_api);
		
	//app.route('/v1/api/:bandId/songs')
	//	.get(users.checkToken_API, songs.unratedSongs_API);

	app.route('/v1/api/:bandId/ratesong/:songId')	
		.post(users.checkToken_API, songs.rateSong);

	app.route('/v1/api/:bandId/suggestions')	
		.get(users.checkToken_API, songs.suggestions);

	app.route('/v1/api/:bandId/suggestions/:songId')	
		.put(users.checkToken_API, songs.suggestionFeedback);


	app.route('/v1/api/:bandId/songs')
		.get(users.checkToken_API, songs.list_api);


	app.route('/v1/api/:bandId/songs/:songId')
		.get(users.checkToken_API, songs.getSong)
		.put(users.checkToken_API, songs.update);

	app.route('/v1/api/searchtrack')
		.post( songs.queryMusixMatch)
		.get( songs.queryMusixMatch);

	app.route('/v1/api/:bandId/songs/addmusicxmatch/:trackId')
		.post(users.checkToken_API, songs.addFromMusixMatch);



	//list unrated songs	
	app.route('/songs/unrated')
		.get(users.requiresLogin, songs.listUnrated);

	app.route('/songs/unrated/:songId')	
		.post(users.requiresLogin, songs.rateSong);

	// Songs Routes
	app.route('/songs')
		.get(songs.list)
		.post(users.requiresLogin, songs.create);

	app.route('/songs/:songId')
		.get(songs.read)
		.put(users.requiresLogin, songs.hasAuthorization, songs.update)
		.delete(users.requiresLogin, songs.hasAuthorization, songs.delete);
		
	app.route('/musicxmatch')
		.post(users.requiresLogin, songs.queryMusixMatch)
		.get(users.requiresLogin, songs.queryMusixMatch);

	app.route('/createmusicxmatch/:trackId')
		.post(users.requiresLogin, songs.createFromMusixMatch);
		

	// Finish by binding the Song middleware
	app.param('bandId', bands.bandByID);
	app.param('songId', songs.songByID);
	app.param('trackId',songs.getMusixMatchFromID);

};
