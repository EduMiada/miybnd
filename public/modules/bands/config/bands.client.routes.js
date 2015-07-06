'use strict';

//Setting up route
angular.module('bands').config(['$stateProvider',
	function($stateProvider) {
		// Bands state routing
		$stateProvider.
		state('listBands', {
			url: '/bands',
			templateUrl: 'modules/bands/views/list-bands.client.view.html'
		}).
		state('createBand', {
			url: '/bands/create',
			templateUrl: 'modules/bands/views/create-band.client.view.html'
		}).
		state('viewBand', {
			url: '/bands/:bandId',
			templateUrl: 'modules/bands/views/view-band.client.view.html'
		}).
		state('editBand', {
			url: '/bands/:bandId/edit',
			templateUrl: 'modules/bands/views/edit-band.client.view.html'
		});
	}
]);