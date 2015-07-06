'use strict';

//Bands service used to communicate Bands REST endpoints
angular.module('bands').factory('Bands', ['$resource',
	function($resource) {
		return $resource('bands/:bandId', { bandId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);