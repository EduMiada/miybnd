'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Setlist = mongoose.model('Setlist'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, setlist;

/**
 * Setlist routes tests
 */
describe('Setlist CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new Setlist
		user.save(function() {
			setlist = {
				name: 'Setlist Name'
			};

			done();
		});
	});

	it('should be able to save Setlist instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Setlist
				agent.post('/setlists')
					.send(setlist)
					.expect(200)
					.end(function(setlistSaveErr, setlistSaveRes) {
						// Handle Setlist save error
						if (setlistSaveErr) done(setlistSaveErr);

						// Get a list of Setlists
						agent.get('/setlists')
							.end(function(setlistsGetErr, setlistsGetRes) {
								// Handle Setlist save error
								if (setlistsGetErr) done(setlistsGetErr);

								// Get Setlists list
								var setlists = setlistsGetRes.body;

								// Set assertions
								(setlists[0].user._id).should.equal(userId);
								(setlists[0].name).should.match('Setlist Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Setlist instance if not logged in', function(done) {
		agent.post('/setlists')
			.send(setlist)
			.expect(401)
			.end(function(setlistSaveErr, setlistSaveRes) {
				// Call the assertion callback
				done(setlistSaveErr);
			});
	});

	it('should not be able to save Setlist instance if no name is provided', function(done) {
		// Invalidate name field
		setlist.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Setlist
				agent.post('/setlists')
					.send(setlist)
					.expect(400)
					.end(function(setlistSaveErr, setlistSaveRes) {
						// Set message assertion
						(setlistSaveRes.body.message).should.match('Please fill Setlist name');
						
						// Handle Setlist save error
						done(setlistSaveErr);
					});
			});
	});

	it('should be able to update Setlist instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Setlist
				agent.post('/setlists')
					.send(setlist)
					.expect(200)
					.end(function(setlistSaveErr, setlistSaveRes) {
						// Handle Setlist save error
						if (setlistSaveErr) done(setlistSaveErr);

						// Update Setlist name
						setlist.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Setlist
						agent.put('/setlists/' + setlistSaveRes.body._id)
							.send(setlist)
							.expect(200)
							.end(function(setlistUpdateErr, setlistUpdateRes) {
								// Handle Setlist update error
								if (setlistUpdateErr) done(setlistUpdateErr);

								// Set assertions
								(setlistUpdateRes.body._id).should.equal(setlistSaveRes.body._id);
								(setlistUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Setlists if not signed in', function(done) {
		// Create new Setlist model instance
		var setlistObj = new Setlist(setlist);

		// Save the Setlist
		setlistObj.save(function() {
			// Request Setlists
			request(app).get('/setlists')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Setlist if not signed in', function(done) {
		// Create new Setlist model instance
		var setlistObj = new Setlist(setlist);

		// Save the Setlist
		setlistObj.save(function() {
			request(app).get('/setlists/' + setlistObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', setlist.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Setlist instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Setlist
				agent.post('/setlists')
					.send(setlist)
					.expect(200)
					.end(function(setlistSaveErr, setlistSaveRes) {
						// Handle Setlist save error
						if (setlistSaveErr) done(setlistSaveErr);

						// Delete existing Setlist
						agent.delete('/setlists/' + setlistSaveRes.body._id)
							.send(setlist)
							.expect(200)
							.end(function(setlistDeleteErr, setlistDeleteRes) {
								// Handle Setlist error error
								if (setlistDeleteErr) done(setlistDeleteErr);

								// Set assertions
								(setlistDeleteRes.body._id).should.equal(setlistSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Setlist instance if not signed in', function(done) {
		// Set Setlist user 
		setlist.user = user;

		// Create new Setlist model instance
		var setlistObj = new Setlist(setlist);

		// Save the Setlist
		setlistObj.save(function() {
			// Try deleting Setlist
			request(app).delete('/setlists/' + setlistObj._id)
			.expect(401)
			.end(function(setlistDeleteErr, setlistDeleteRes) {
				// Set message assertion
				(setlistDeleteRes.body.message).should.match('User is not logged in');

				// Handle Setlist error error
				done(setlistDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Setlist.remove().exec();
		done();
	});
});