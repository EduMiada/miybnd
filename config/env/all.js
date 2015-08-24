'use strict';

module.exports = {
	app: {
		title: 'MIYBND',
		description: 'Full-Stack JavaScript with MongoDB, Express, AngularJS, and Node.js',
		keywords: 'MongoDB, Express, AngularJS, Node.js'
	},
	port: process.env.PORT || 3000,
	templateEngine: 'swig',
	sessionSecret: 'MEAN',
	sessionCollection: 'sessions',
	assets: {
		lib: {
			css: [
				'public/lib/bootstrap/dist/css/bootstrap.css',
				'public/lib/bootstrap/dist/css/bootstrap-theme.css',
				'public/lib/mdi/css/materialdesignicons.min.css',
				'public/lib/ng-sortable/dist/dist/ng-sortable.min.css',
				'public/lib/ng-sortable/dist/dist/ng-sortable.style.min.css'
	
			],
			js: [
				'public/lib/jquery/dist/jquery.min.js', 
				'public/lib/angular/angular.js',
				'public/lib/angular-resource/angular-resource.js', 
				'public/lib/angular-cookies/angular-cookies.js', 
				'public/lib/angular-animate/angular-animate.js', 
				'public/lib/angular-aria/angular-aria.js',
				'public/lib/angular-touch/angular-touch.js', 
				'public/lib/angular-sanitize/angular-sanitize.js', 
				'public/lib/angular-ui-router/release/angular-ui-router.js',
				'public/lib/angular-ui-utils/ui-utils.js',
				'public/lib/angular-bootstrap/ui-bootstrap-tpls.js',
				'public/lib/angular-busy/dist/angular-busy.js',
			    'public/lib/angular-material/angular-material.js',
				'public/lib/angular-bootstrap/ui-bootstrap-tpls.js',
				'public/lib/ng-mfb/src/mfb-directive.js',
				'public/lib/ng-sortable/dist/ng-sortable.min.js',
				'public/lib/moment/min/moment.min.js',
				'public/lib/angular-moment/angular-moment.min.js',
				'public/lib/spin.js/spin.js',
				'public/lib/angular-spinner/angular-spinner.min.js',
				'public/lib/angular-loading-spinner/angular-loading-spinner.js'
				
				
				
				//'public/lib/angular-flash-alert/dist/angular-flash.js'

				
			]
		},
		css: [
			'public/modules/**/css/*.css'
		],
		js: [
			'public/config.js',
			'public/application.js',
			'public/modules/*/*.js',
			'public/modules/*/*[!tests]*/*.js'
		],
		tests: [
			'public/lib/angular-mocks/angular-mocks.js',
			'public/modules/*/tests/*.js'
		]
	}
};