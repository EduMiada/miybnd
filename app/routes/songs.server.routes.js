'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var songs = require('../../app/controllers/songs.server.controller');

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
	app.param('songId', songs.songByID);
	app.param('trackId',songs.getMusixMatchFromID);

};
