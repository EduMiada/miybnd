'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var bands = require('../../app/controllers/bands.server.controller');

	app.route('/v1/api/bands')
		.get(users.checkToken_API, bands.list);
		  
    app.route('/v1/api/bands/:bandId')
		.get(users.checkToken_API, bands.getBand)
        .put(users.checkToken_API, bands.update);
        
	app.route('/v1/api/bands/create')
		.post(users.checkToken_API, bands.create);

	// Bands Routes
	// Songs Routes
	app.route('/bands')
		.get(bands.list)
		.post(users.requiresLogin, bands.create);

	app.route('/bands/:bandId')
		.get(bands.read)
		.put(users.requiresLogin, bands.hasAuthorization, bands.update)
		.delete(users.requiresLogin, bands.hasAuthorization, bands.delete);

	app.route('/searchMembers')
		.get(users.requiresLogin, bands.seachNewMembers);
		
	// Finish by binding the Band middleware
	app.param('bandId', bands.bandByID);

};
