'use strict';

module.exports = {
	db: 'mongodb://localhost/miybnd-dev',
	app: {
		title: 'MIYBND - Development Environment'
	},
	spotify: {
        clientID: '5063d7fc578d4b928e96e050790860c9' || 'APP_ID',
        clientSecret: 'f6f4758ea04942668385ab0d4953e014' || 'APP_SECRET',
        callbackURL: "/auth/spotify/callback"
    },
	facebook: {
		clientID: '162584200776112' || 'APP_ID',
		clientSecret: '99cbd345ef5002f60e56e89b9d5eb4a9' || 'APP_SECRET',
		callbackURL: '/auth/facebook/callback'
	},
	twitter: {
		clientID: process.env.TWITTER_KEY || 'CONSUMER_KEY',
		clientSecret: process.env.TWITTER_SECRET || 'CONSUMER_SECRET',
		callbackURL: '/auth/twitter/callback'
	},
	google: {
		clientID:'543966572181-ap52ouh5ku4ngurn0l3ovdob7k82dq1s.apps.googleusercontent.com' || 'APP_ID',
		clientSecret:'5sELnUtODi1z4UDTYrIkAUbR' || 'APP_SECRET',
		callbackURL: '/auth/google/callback'
	},
	linkedin: {
		clientID: process.env.LINKEDIN_ID || 'APP_ID',
		clientSecret: process.env.LINKEDIN_SECRET || 'APP_SECRET',
		callbackURL: '/auth/linkedin/callback'
	},
	github: {
		clientID: process.env.GITHUB_ID || 'APP_ID',
		clientSecret: process.env.GITHUB_SECRET || 'APP_SECRET',
		callbackURL: '/auth/github/callback'
	},
	mailer: {
		from: process.env.MAILER_FROM || 'MAILER_FROM',
		options: {
			service: process.env.MAILER_SERVICE_PROVIDER || 'MAILER_SERVICE_PROVIDER',
			auth: {
				user: process.env.MAILER_EMAIL_ID || 'MAILER_EMAIL_ID',
				pass: process.env.MAILER_PASSWORD || 'MAILER_PASSWORD'
			}
		}
	}
};
