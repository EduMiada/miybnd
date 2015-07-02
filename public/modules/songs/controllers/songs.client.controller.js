'use strict';

// Songs controller
angular.module('songs').controller('SongsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Songs', 'UnratedSongs' , '$http', '$mdDialog', '$mdToast','songsService',
	function($scope, $stateParams, $location, Authentication, Songs, UnratedSongs, $http, $mdDialog, $mdToast, songsService) {
		$scope.authentication = Authentication;

		/*--------------------------------------
		Scope variables - general functions
		--------------------------------------*/
		//song rating code
		$scope.rate = 0;
		$scope.max = 5;
		
		//selected grid rows
 		$scope.selected = [];
		
		
		$scope.FSisOpen = false;
	
		$scope.$back = function() { 
			$scope.FSisOpen = false;
			window.history.back();
		};

		$scope.showMessage = function (message) {
   			$mdToast.show(
		      	$mdToast.simple()
		        .content(message)
		        .position('bottom center')
		        .hideDelay(3000)
	    	);
		};
		
		
		
		

		
		/*------------------------------------------
		PAGE CONTROLER
		-------------------------------------------*/
		$scope.itemsPerPage = 3;
		//$scope.totalItems = 15;
		$scope.currentPage = 1;

		$scope.setPage = function (pageNo) {
			$scope.currentPage = pageNo;
		};

		
		
		/*----------------------------------------
		DROP DOWN ICON MENU
		-----------------------------------------*/
		$scope.status = {
		   isopen: false
		 };
		
		$scope.toggleDropdown = function($event) {
			$event.preventDefault();
			$event.stopPropagation();
			$scope.status.isopen = !$scope.status.isopen;
		};


	
		
		/*----------------------------------------
		GRID FUNCTIONS
		-----------------------------------------*/
		$scope.sort = {
            column: '',
            descending: false
        };    

		//altera ordem das colunas do grid
  		$scope.changeSorting = function(column) {
            var sort = $scope.sort;
 
            if (sort.column === column) {
                sort.descending = !sort.descending;
            } else {
                sort.column = column;
                sort.descending = false;
            }
		
        };
		
		$scope.toggle = function (item, list) {
			var idx = list.indexOf(item);
			if (idx > -1) list.splice(idx, 1);
				else list.push(item);
		
			songsService.setSelectedSongs(list);
			
		};
		
		$scope.exists = function (item, list) {
			return list.indexOf(item) > -1;
		};	
		
		$scope.openDetail = function(songID){
			$location.path('songs/' + songID);
		};

		/*----------------------------------------
		Manage Songs
		-----------------------------------------*/

		$scope.$edit = function() {
			if ( $scope.song ) { 		
					$location.path('songs/' + $scope.song._id +  '/edit');
			}
		};

		// Create new Song
		$scope.create = function() {
			// Create new Song object
			var song = new Songs ({
				name: this.name
			});

			// Redirect after save
			song.$save(function(response) {
				$location.path('songs/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Song
		$scope.remove = function(song) {
			if ( song ) { 
				song.$remove();

				for (var i in $scope.songs) {
					if ($scope.songs [i] === song) {
						$scope.songs.splice(i, 1);
					}
				}
			} else {
				$scope.song.$remove(function() {
					$location.path('songs');
				});
			}
		};

		// Update existing Song
		$scope.update = function() {
			var song = $scope.song;

			song.$update(function() {
				$location.path('songs/' + song._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Filter by type
		$scope.findByType = function(typeEnum) {
			$scope.songs = Songs.query({'filterType': typeEnum});
		};
		
		// Find a list of Songs
		$scope.find = function() {
			//se estiver na home mostra unrated , senao mostra repertorio
			if($location.path() === '/'){
				$scope.unratedSongs = UnratedSongs.query();
				$scope.totalItems = $scope.unratedSongs.length;
			}else{
				$scope.songs = Songs.query();			
				$scope.totalItems = $scope.songs.length;
			}
		};

		// Find existing Song
		$scope.findOne = function() {
			$scope.song = Songs.get({ 
				songId: $stateParams.songId
			});
		};



		/*------------------------------
		Rate song actions
		--------------------------------*/
		//star rate onhover		
		$scope.hoveringOver = function(value) {
			$scope.overStar = value;
			$scope.percent = 100 * (value / $scope.max);
		};

		//rate song click
		$scope.rateSong = function(songID, rate){		
			if(rate!==0){
				$scope.unratedSongs =  UnratedSongs.post({songId: songID, rateNumber:rate});
			}
		};


		
		

		/*------------------------------
		MusixMatch actions
		--------------------------------*/
		//When selected musixmatch from list
	 	$scope.onSelect = function ($item, $model, $label) {
	    	$scope.newTrackID = $item.track_id; 
		};
		
		//seach with typeahead musixmatch
		$scope.searchMusixMatch = function(val) {
		    return $http.get('musicxmatch', {params: { music: val, sensor: false}
		    }).then(function(response){
			      	return response.data.map(function(item){
			        	return item;
			     });
		    });
		};

		
		//add  music  from musixmatch
	 	$scope.addFromMusixmatch = function () {
	   		$scope.error = null; 
			$scope.asyncSelected = null;

			$scope.myPromise =	$http.post('/createmusicxmatch/' + $scope.newTrackID + '?status=' + $scope.addStatus  )
		        .success(function(response) {
					$scope.showMessage('Song added successfuly! Press (F5) to refresh :-)');
					$scope.find();	          
		        })
		        .error(function(response) {
					$scope.showMessage(response.message);		 
		        });		
		};



	} //end of module
]);