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


/*angular.module('songs').factory('BandMembers', ['$resource',
  function($resource) {
    return $resource('/bands/list/', { bandId: '@_id'}, {
      update: {
        method: 'PUT'
      },
      post: { method: 'POST', params: { songId:'@songId', rateNumber:'@rateNumber'}, isArray: true },
	    query: { method: 'GET', params: {}, isArray: true }
    });
  }

]);
*/