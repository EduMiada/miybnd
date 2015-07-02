'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var setlists = require('../../app/controllers/setlists.server.controller');

	// Setlists Routes
	app.route('/setlists')
		.get(setlists.list)
		.post(users.requiresLogin, setlists.create);

	app.route('/setlists/:setlistId')
		.get(setlists.read)
		.put(users.requiresLogin, setlists.hasAuthorization, setlists.update)
		.delete(users.requiresLogin, setlists.hasAuthorization, setlists.delete);

	// Finish by binding the Setlist middleware
	app.param('setlistId', setlists.setlistByID);
};
