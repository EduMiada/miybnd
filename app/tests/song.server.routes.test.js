'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Song = mongoose.model('Song'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, song;

/**
 * Song routes tests
 */
describe('Song CRUD tests', function() {
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

		// Save a user to the test db and create new Song
		user.save(function() {
			song = {
				name: 'Song Name'
			};

			done();
		});
	});

	it('should be able to save Song instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Song
				agent.post('/songs')
					.send(song)
					.expect(200)
					.end(function(songSaveErr, songSaveRes) {
						// Handle Song save error
						if (songSaveErr) done(songSaveErr);

						// Get a list of Songs
						agent.get('/songs')
							.end(function(songsGetErr, songsGetRes) {
								// Handle Song save error
								if (songsGetErr) done(songsGetErr);

								// Get Songs list
								var songs = songsGetRes.body;

								// Set assertions
								(songs[0].user._id).should.equal(userId);
								(songs[0].name).should.match('Song Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Song instance if not logged in', function(done) {
		agent.post('/songs')
			.send(song)
			.expect(401)
			.end(function(songSaveErr, songSaveRes) {
				// Call the assertion callback
				done(songSaveErr);
			});
	});

	it('should not be able to save Song instance if no name is provided', function(done) {
		// Invalidate name field
		song.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Song
				agent.post('/songs')
					.send(song)
					.expect(400)
					.end(function(songSaveErr, songSaveRes) {
						// Set message assertion
						(songSaveRes.body.message).should.match('Please fill Song name');
						
						// Handle Song save error
						done(songSaveErr);
					});
			});
	});

	it('should be able to update Song instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Song
				agent.post('/songs')
					.send(song)
					.expect(200)
					.end(function(songSaveErr, songSaveRes) {
						// Handle Song save error
						if (songSaveErr) done(songSaveErr);

						// Update Song name
						song.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Song
						agent.put('/songs/' + songSaveRes.body._id)
							.send(song)
							.expect(200)
							.end(function(songUpdateErr, songUpdateRes) {
								// Handle Song update error
								if (songUpdateErr) done(songUpdateErr);

								// Set assertions
								(songUpdateRes.body._id).should.equal(songSaveRes.body._id);
								(songUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Songs if not signed in', function(done) {
		// Create new Song model instance
		var songObj = new Song(song);

		// Save the Song
		songObj.save(function() {
			// Request Songs
			request(app).get('/songs')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Song if not signed in', function(done) {
		// Create new Song model instance
		var songObj = new Song(song);

		// Save the Song
		songObj.save(function() {
			request(app).get('/songs/' + songObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', song.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Song instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Song
				agent.post('/songs')
					.send(song)
					.expect(200)
					.end(function(songSaveErr, songSaveRes) {
						// Handle Song save error
						if (songSaveErr) done(songSaveErr);

						// Delete existing Song
						agent.delete('/songs/' + songSaveRes.body._id)
							.send(song)
							.expect(200)
							.end(function(songDeleteErr, songDeleteRes) {
								// Handle Song error error
								if (songDeleteErr) done(songDeleteErr);

								// Set assertions
								(songDeleteRes.body._id).should.equal(songSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Song instance if not signed in', function(done) {
		// Set Song user 
		song.user = user;

		// Create new Song model instance
		var songObj = new Song(song);

		// Save the Song
		songObj.save(function() {
			// Try deleting Song
			request(app).delete('/songs/' + songObj._id)
			.expect(401)
			.end(function(songDeleteErr, songDeleteRes) {
				// Set message assertion
				(songDeleteRes.body.message).should.match('User is not logged in');

				// Handle Song error error
				done(songDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Song.remove().exec();
		done();
	});
});