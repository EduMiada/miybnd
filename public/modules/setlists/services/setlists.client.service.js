'use strict';

//Setlists service used to communicate Setlists REST endpoints
angular.module('setlists').factory('Setlists', ['$resource',
	function($resource) {
		return $resource('setlists/:setlistId', { setlistId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);