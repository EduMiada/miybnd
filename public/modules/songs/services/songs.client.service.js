'use strict';

//Songs service used to communicate Songs REST endpoints
angular.module('songs').factory('Songs', ['$resource',
	function($resource) {
		return $resource('songs/:songId', { songId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
  
  
 



]);


angular.module('songs').factory('UnratedSongs', ['$resource',
  function($resource) {
    return $resource('/songs/unrated/:songId', { songId: '@_id'}, {
      update: {
        method: 'PUT'
      },
      post: { method: 'POST', params: { songId:'@songId', rateNumber:'@rateNumber'}, isArray: true }
	  //, query: { method: 'GET', params: {}, isArray: true }
    });
  }

]);


angular.module('songs').service('songsService', function () {
   var selectedSongs = [];

  var setSelectedSongs = function(newArray) {
      selectedSongs = newArray;
  };

  var addSong = function(newObj) {
      selectedSongs.push(newObj);
  };

  var getSelectedSongs = function(){
      return selectedSongs;
  };

  return {
    addSong: addSong,
    getSelectedSongs: getSelectedSongs,
    setSelectedSongs: setSelectedSongs
  };
});