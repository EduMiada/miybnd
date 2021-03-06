'use strict';

/**
 * Module dependencies.
 */
var users = require('../../app/controllers/users.server.controller'),
	articles = require('../../app/controllers/articles.server.controller'),
	push = require('../../app/notifications/notifications');

module.exports = function(app) {
	// Article Routes
	app.route('/articles')
		.get(users.requiresLogin,articles.list)
		.post(users.requiresLogin, articles.create);
		
	app.route('/push')
		.get(push.pushNotification)

	app.route('/articles/:articleId')
		.get(articles.read)
		.put(users.requiresLogin, articles.hasAuthorization, articles.update)
		.delete(users.requiresLogin, articles.hasAuthorization, articles.delete);

	// Finish by binding the article middleware
	app.param('articleId', articles.articleByID);
};