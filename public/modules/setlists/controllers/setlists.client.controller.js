'use strict';

// Setlists controller
angular.module('setlists').controller('SetlistsController', ['$scope',  '$stateParams', '$location', 'Authentication', 'Setlists', '$mdDialog','$mdToast','Songs', '$http',
	function($scope, $stateParams, $location, Authentication, Setlists, $mdDialog, $mdToast, Songs, $http) {
		$scope.authentication = Authentication;

		$scope.setlistName = '';

		/*--------------------------------------
		Scope variables - general functions
		--------------------------------------*/
		$scope.viewModePlay = false;
		
		$scope.formatDuration = function(value){
			//alert( moment.duration(100, 'seconds').humanize);
			return moment.duration(value, 'seconds').humanize();
		};
		
		
		$scope.showMessage = function (message) {
   			$mdToast.show(
		      	$mdToast.simple()
		        .content(message)
		        .position('bottom center')
		        .hideDelay(3000)
	    	);
		};
		
		$scope.loadButtonsMenu = function(){
			$scope.buttons = [{
			  label: 'Delete setlist',
			  icon: 'glyphicon glyphicon-trash',
			  event: 'remove()'
			},{
			  label: 'Add song',
			  icon: 'glyphicon glyphicon-plus',
			  event: 'showSongsDialog($event, selected)'
			}];
			
			if (($scope.isConnectedSocialAccount('spotify') && $scope.isSpotifyPlaylistOwner()) || $scope.setlist.spotifyPlaylistId === undefined ){
				if($scope.setlist.spotifyPlaylistId==undefined){
					$scope.buttons.push({
						  label: 'Create Spotify Playlist',
						  icon: 'glyphicon glyphicon-music',
						  event: 'createSpotifyPlaylist()'
						});
				}else{
					$scope.buttons.push({
						  label: 'Update Spotify Playlist',
						  icon: 'glyphicon glyphicon-music',
						  event: 'updateSpotifyPlaylist()'
					});
				}
			} //connected to spotify and playlist owner
			
			//connected to spotify but not owner
			if ($scope.isConnectedSocialAccount('spotify') && !$scope.isSpotifyPlaylistOwner() && $scope.setlist.spotifyPlaylistId !==undefined){
					$scope.buttons.push({
						  label: 'Follow Spotify Playlist',
						  icon: 'glyphicon glyphicon-music',
						  event: 'followSpotifyPlaylist()'
					});
			}
			
		};
		
		//Tongle Play mode and get songs full data w lyrics
		$scope.tonglePlayMode = function(mode){
			$scope.success = $scope.error = null;
			
			if (mode){
			
				$http.get('/setlists/songs/' + $scope.setlist._id, { setlistId:  $scope.setlist._id }).success(function(response) {
					// If successful show success message and clear form
					$scope.success = true;
					$scope.setlist = response;
				}).error(function(response) {
					$scope.error = response.message;
				});
			}else{
				$scope.findOne();
			}
		};
		
		/*------------------------------------------
		PAGE CONTROLER
		-------------------------------------------*/
		$scope.itemsPerPage = 1;
		//$scope.totalItems = 15;
		$scope.currentPage = 1;

		$scope.setPage = function (pageNo) {
			$scope.currentPage = pageNo;
		};
		
		
		$scope.createSpotifyPlaylist = function(){
			$scope.success = $scope.error = null;
			$http.post('/setlists/spotify/create/' + $scope.setlist._id, { setlistId:  $scope.setlist._id }).success(function(response) {
				// If successful show success message and clear form
				$scope.success = true;
				$scope.showMessage('Spotify Playlist created | ' + $scope.setlist.name);
				//$scope.user = Authentication.user = response;
				//$rootScope.$broadcast('changeUserSelectedBand', Authentication);		
			}).error(function(response) {
				$scope.error = response.message;
			});
	
		};
		
		// Check if provider is already in use with current user
		$scope.isConnectedSocialAccount = function(provider) {
			return $scope.authentication.user.provider === provider || ($scope.authentication.user.additionalProvidersData && $scope.authentication.user.additionalProvidersData[provider]);
		};
				
		$scope.isSpotifyPlaylistOwner = function(){
			//alert($scope.authentication.user.additionalProvidersData.spotify.id);
			//alert($scope.setlist.spotifyOwnerId);
			
			return $scope.authentication.user.additionalProvidersData.spotify.id === $scope.setlist.spotifyOwnerId;
		};
		 
		$scope.updateSpotifyPlaylist = function(){
			$scope.success = $scope.error = null;
			$http.post('/setlists/spotify/update/' + $scope.setlist._id, { setlistId:  $scope.setlist._id }).success(function(response) {
				// If successful show success message and clear form
				$scope.success = true;
				$scope.showMessage('Spotify Playlist updated.');
				//$scope.user = Authentication.user = response;
				//$rootScope.$broadcast('changeUserSelectedBand', Authentication);		
			}).error(function(response) {
				$scope.error = response.message;
			});
	
		};
		
		
		$scope.followSpotifyPlaylist = function(){
			$scope.success = $scope.error = null;
			$http.post('/setlists/spotify/follow/' + $scope.setlist._id, { setlistId:  $scope.setlist._id }).success(function(response) {
				$scope.success = true;
				$scope.showMessage('You are now following the Spotify Playlist');
			}).error(function(response) {
				$scope.error = response.message;
			});
	
		};
    
    /*---------------------------------------------
		DIALOG LIST SONG
		----------------------------------------------*/
	
		$scope.showSongsDialog = function(ev, songs) {
			//list songs
			$scope.songs = Songs.query();		

			$mdDialog.show({
			  controller: DialogController,
			  templateUrl: 'modalListSongs.tmpl.html',
			  parent: angular.element(document.body), 
			  targetEvent: ev,
			  locals: {
			       items: $scope.songs
			     },
			})
			.then(function(response) {
			  var songs = response.setlist;
			  
			      for (var i = 0; i < songs.length; i++) {
			          var item = {
			              '_id':songs[i], 
			              'order':9999,
			              'song': songs[i]
			          };
			           $scope.setlist.songs.push(item);
			      }
			      
			      	$scope.setlist.$update(function() {
			  		$scope.findOne();
			        $scope.showMessage(songs.length + ' song added to setlist.');
			          			 	
			  			}, function(errorResponse) {
			  				$scope.error = errorResponse.data.message;
			  			});
			        
			    
			
			}, function() {
			  $scope.alert = 'You cancelled the dialog.';
			});
		};




  		/*---------------------------------------------
		DIALOG NEW SETLIST
		----------------------------------------------*/
	
		$scope.showNewSetlistDialog = function(ev, songs) {
		  
		  $mdDialog.show({
	      controller: DialogController,
	      templateUrl: 'modalNewSetlist.tmpl.html',
	      parent: angular.element(document.body),
	      targetEvent: ev,
	      locals: {
	           items: null
	         },
	    })
	    .then(function(response) {
			var setlist = new Setlists ({name: response});		
				
			setlist.$save(function() {
				$scope.find();
				$scope.showMessage('Setlist created sucessfully | ' + setlist.name);
			}, function(errorResponse) {
				$scope.showMessage(errorResponse.data.message);				
			});		      	
		}, function() {
	      $scope.alert = 'You cancelled the dialog.';
	    });
	 };




$scope.dragControlListeners = {
//    accept: function (sourceItemHandleScope, destSortableScope) {return boolean}, //override to determine drag is allowed or not. default is true.
 //   itemMoved: function (event) {
      //Do what you want
  //    },
    orderChanged: function(event) {
      //update the order field and save      
      angular.forEach($scope.setlist.songs, function(u, i) {
          $scope.setlist.songs[i].order = i+1;
      });

      $scope.setlist.$update(function() {
				$scope.find();
        
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
      
      
    
    
   },
    containment: '#sortable-container' //, //optional param.
	//containerPositioning: 'relative'
};


$scope.removeSong = function(index){
    $scope.setlist.songs.splice(index,1);
   // var setlist = $scope.setlist;

			$scope.setlist.$update(function() {
				$scope.find();
        
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
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

		//select grid rows
 		//$scope.selected = [];
		
		//$scope.toggle = function (item, list) {
	//		var idx = list.indexOf(item);
	//		if (idx > -1) list.splice(idx, 1);
	//			else list.push(item);
	//		};
	//		$scope.exists = function (item, list) {
	//		return list.indexOf(item) > -1;
	//	};	
		
		$scope.openDetail = function(setlistID){
			$location.path('setlists/' + setlistID);
		};



	/*----------------------------------------
	DIALOG LIST SETLISTS
	-----------------------------------------*/

	$scope.showSetlistDialog = function(ev, songs) {

		$scope.find();


	    $mdDialog.show({
	      controller: DialogController,
	      templateUrl: 'dialog1.tmpl.html',
	      parent: angular.element(document.body),
	      targetEvent: ev,
	      locals: {
	           items: $scope.setlists
	         },
	    })
	    .then(function(response) {
			var setlist;
			var msg = '';
			
			if (!response.setlist){
				setlist = new Setlists ({name: response.name,  songs:[]});		
				
				$scope.splitSongs (setlist, songs) ;
			
				setlist.$save(function() {
		    		$scope.showMessage(songs.length + ' added to setlist | ' + setlist.name);
				}, function(errorResponse) {
					$scope.showMessage(errorResponse.data.message);				});
		        				
			}else{
				setlist = response.setlist;
				$scope.splitSongs (setlist, songs) ;
				
				setlist.$update(function() {
		    		 //msg = songs.length + ' added to setlist ';
					$scope.showMessage(songs.length + ' added to setlist | '  + setlist.name );
				}, function(errorResponse) {
					$scope.showMessage(errorResponse.data.message);
				});
		      	
			}
			
			
	
	    }, function() {
	      $scope.alert = 'You cancelled the dialog.';
	    });
	 };

		
		$scope.splitSongs = function(setlist, songs){
			for (var i = 0; i < songs.length; i++) {
				  var item = {'order':9999, 'song': songs[i]};
				   setlist.songs.push(item);
				}
			
		};


		// Create new Setlist
		$scope.create = function() {
			// Create new Setlist object
			var setlist = new Setlists ({
				name: this.name
			});

			// Redirect after save
			setlist.$save(function(response) {
				$location.path('setlists/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Setlist
		$scope.remove = function(setlist) {
			if ( setlist ) { 
				setlist.$remove();

				for (var i in $scope.setlists) {
					if ($scope.setlists [i] === setlist) {
						$scope.setlists.splice(i, 1);
					}
				}
			} else {
				$scope.setlist.$remove(function() {
					$location.path('setlists');
				});
			}
		};

		// Update existing Setlist
		$scope.update = function() {
			var setlist = $scope.setlist;

			setlist.$update(function() {
				$location.path('setlists/' + setlist._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Setlists
		$scope.find = function() {
			//$scope.loadButtonsMenu();
			$scope.setlists = Setlists.query();
		
		};

		// Find existing Setlist
		$scope.findOne = function() {
		
			$scope.setlist = Setlists.get({setlistId: $stateParams.setlistId}, function(){
				
				$scope.loadButtonsMenu();
				
			});
			
			
		};
	}
]);

function DialogController($scope, $mdDialog, items) {
  
  $scope.setlistName = '';
  $scope.items = items;
  $scope.selected = [];
  
  $scope.hide = function() {
    $mdDialog.hide();
  };
  $scope.cancel = function() {
    $mdDialog.cancel();
  };
  $scope.add = function(answer) {
    $mdDialog.hide(answer, null);
  };
 
  $scope.save = function() {
    $mdDialog.hide($scope.setlistName);
  };
 
  
  $scope.modalAddToExistingSetlist = function(item) {
  	var response = {setlist:item, name:null} ;
    $mdDialog.hide(response);
  };
  
  $scope.modalAddtoNewSetlist = function(){
	 var response = {setlist:null, name:$scope.setlistName} ;
	 $mdDialog.hide(response);
  };
  
  
  $scope.toggle = function (item, list) {
			var idx = list.indexOf(item);
			if (idx > -1) list.splice(idx, 1);
				else list.push(item);
		
			
		};
		
		$scope.exists = function (item, list) {
			return list.indexOf(item) > -1;
		};	
		
}
