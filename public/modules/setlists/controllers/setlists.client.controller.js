'use strict';

// Setlists controller
angular.module('setlists').controller('SetlistsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Setlists', '$mdDialog','$mdToast','Songs',
	function($scope, $stateParams, $location, Authentication, Setlists, $mdDialog, $mdToast, Songs) {
		$scope.authentication = Authentication;


		$scope.setlistName = '';

		/*--------------------------------------
		Scope variables - general functions
		--------------------------------------*/
		$scope.viewModePlay = false;
		
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
		$scope.itemsPerPage = 1;
		//$scope.totalItems = 15;
		$scope.currentPage = 1;

		$scope.setPage = function (pageNo) {
			$scope.currentPage = pageNo;
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
    containment: '#tableContainer'//optional param.
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
				setlist = new Setlists ({name: response.name, songs:[]});		
				
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
		  var item = {
		      '_id':songs[i], 
		      'order':9999,
		      'song': songs[i]
		  };
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
			$scope.setlists = Setlists.query();
		};

		// Find existing Setlist
		$scope.findOne = function() {
			$scope.setlist = Setlists.get({ 
				setlistId: $stateParams.setlistId
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


/*
 $scope.showAlert = function(ev) {
    // Appending dialog to document.body to cover sidenav in docs app
    // Modal dialogs should fully cover application
    // to prevent interaction outside of dialog
    $mdDialog.show(
      $mdDialog.alert()
        .parent(angular.element(document.body))
        .title('This is an alert title')
        .content('You can specify some description text in here.')
        .ariaLabel('Alert Dialog Demo')
        .ok('Got it!')
        .targetEvent(ev)
    );
  };
  $scope.showConfirm = function(ev) {
    // Appending dialog to document.body to cover sidenav in docs app
    var confirm = $mdDialog.confirm()
      .parent(angular.element(document.body))
      .title('Would you like to delete your debt?')
      .content('All of the banks have agreed to forgive you your debts.')
      .ariaLabel('Lucky day')
      .ok('Please do it!')
      .cancel('Sounds like a scam')
      .targetEvent(ev);
    $mdDialog.show(confirm).then(function() {
      $scope.alert = 'You decided to get rid of your debt.';
    }, function() {
      $scope.alert = 'You decided to keep your debt.';
    });
  };
  
  */