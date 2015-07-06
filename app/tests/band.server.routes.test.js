'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Band = mongoose.model('Band'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, band;

/**
 * Band routes tests
 */
describe('Band CRUD tests', function() {
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

		// Save a user to the test db and create new Band
		user.save(function() {
			band = {
				name: 'Band Name'
			};

			done();
		});
	});

	it('should be able to save Band instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Band
				agent.post('/bands')
					.send(band)
					.expect(200)
					.end(function(bandSaveErr, bandSaveRes) {
						// Handle Band save error
						if (bandSaveErr) done(bandSaveErr);

						// Get a list of Bands
						agent.get('/bands')
							.end(function(bandsGetErr, bandsGetRes) {
								// Handle Band save error
								if (bandsGetErr) done(bandsGetErr);

								// Get Bands list
								var bands = bandsGetRes.body;

								// Set assertions
								(bands[0].user._id).should.equal(userId);
								(bands[0].name).should.match('Band Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Band instance if not logged in', function(done) {
		agent.post('/bands')
			.send(band)
			.expect(401)
			.end(function(bandSaveErr, bandSaveRes) {
				// Call the assertion callback
				done(bandSaveErr);
			});
	});

	it('should not be able to save Band instance if no name is provided', function(done) {
		// Invalidate name field
		band.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Band
				agent.post('/bands')
					.send(band)
					.expect(400)
					.end(function(bandSaveErr, bandSaveRes) {
						// Set message assertion
						(bandSaveRes.body.message).should.match('Please fill Band name');
						
						// Handle Band save error
						done(bandSaveErr);
					});
			});
	});

	it('should be able to update Band instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Band
				agent.post('/bands')
					.send(band)
					.expect(200)
					.end(function(bandSaveErr, bandSaveRes) {
						// Handle Band save error
						if (bandSaveErr) done(bandSaveErr);

						// Update Band name
						band.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Band
						agent.put('/bands/' + bandSaveRes.body._id)
							.send(band)
							.expect(200)
							.end(function(bandUpdateErr, bandUpdateRes) {
								// Handle Band update error
								if (bandUpdateErr) done(bandUpdateErr);

								// Set assertions
								(bandUpdateRes.body._id).should.equal(bandSaveRes.body._id);
								(bandUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Bands if not signed in', function(done) {
		// Create new Band model instance
		var bandObj = new Band(band);

		// Save the Band
		bandObj.save(function() {
			// Request Bands
			request(app).get('/bands')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Band if not signed in', function(done) {
		// Create new Band model instance
		var bandObj = new Band(band);

		// Save the Band
		bandObj.save(function() {
			request(app).get('/bands/' + bandObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', band.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Band instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Band
				agent.post('/bands')
					.send(band)
					.expect(200)
					.end(function(bandSaveErr, bandSaveRes) {
						// Handle Band save error
						if (bandSaveErr) done(bandSaveErr);

						// Delete existing Band
						agent.delete('/bands/' + bandSaveRes.body._id)
							.send(band)
							.expect(200)
							.end(function(bandDeleteErr, bandDeleteRes) {
								// Handle Band error error
								if (bandDeleteErr) done(bandDeleteErr);

								// Set assertions
								(bandDeleteRes.body._id).should.equal(bandSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Band instance if not signed in', function(done) {
		// Set Band user 
		band.user = user;

		// Create new Band model instance
		var bandObj = new Band(band);

		// Save the Band
		bandObj.save(function() {
			// Try deleting Band
			request(app).delete('/bands/' + bandObj._id)
			.expect(401)
			.end(function(bandDeleteErr, bandDeleteRes) {
				// Set message assertion
				(bandDeleteRes.body.message).should.match('User is not logged in');

				// Handle Band error error
				done(bandDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Band.remove().exec();
		done();
	});
});