'use strict';

// Init the application configuration module for AngularJS application
var ApplicationConfiguration = (function() {
	// Init module configuration options
	var applicationModuleName = 'miybnd';
	var applicationModuleVendorDependencies = ['ngResource', 'ngCookies',  'ngAnimate',  'ngTouch',  'ngSanitize',  'ui.router', 'ui.bootstrap', 
		'ui.utils','cgBusy','ngMaterial','ngAria','ng-mfb', 'ui.sortable'];

	// Add a new vertical module
	var registerModule = function(moduleName, dependencies) {
		// Create angular module
		angular.module(moduleName, dependencies || []);

		// Add the module to the AngularJS configuration file
		angular.module(applicationModuleName).requires.push(moduleName);
	};

	return {
		applicationModuleName: applicationModuleName,
		applicationModuleVendorDependencies: applicationModuleVendorDependencies,
		registerModule: registerModule
	};
})();
'use strict';

//Start by defining the main module and adding the module dependencies
angular.module(ApplicationConfiguration.applicationModuleName, ApplicationConfiguration.applicationModuleVendorDependencies);

// Setting HTML5 Location Mode
angular.module(ApplicationConfiguration.applicationModuleName).config(['$locationProvider', '$mdThemingProvider',
	function($locationProvider,$mdThemingProvider) {
		$locationProvider.hashPrefix('!');

		 $mdThemingProvider.theme('default')
		    .primaryPalette('blue')
		    .accentPalette('green');
		
	}
]);

//Then define the init function for starting up the application
angular.element(document).ready(function() {
	//Fixing facebook bug with redirect
	if (window.location.hash === '#_=_') window.location.hash = '#!';

	//Then init the app
	angular.bootstrap(document, [ApplicationConfiguration.applicationModuleName]);
});


'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('articles');
'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('bands');
'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('core');
'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('setlists');
'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('songs');
'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('users');
'use strict';

// Configuring the Articles module
//angular.module('articles').run(['Menus',
//	function(Menus) {
		// Set top bar menu items
//		Menus.addMenuItem('topbar', 'Articles', 'articles', 'dropdown', '/articles(/create)?');
//		Menus.addSubMenuItem('topbar', 'articles', 'List Articles', 'articles');
//		Menus.addSubMenuItem('topbar', 'articles', 'New Article', 'articles/create');
//	}
//]);
'use strict';

// Setting up route
angular.module('articles').config(['$stateProvider',
	function($stateProvider) {
		// Articles state routing
		$stateProvider.
		state('listArticles', {
			url: '/articles',
			templateUrl: 'modules/articles/views/list-articles.client.view.html'
		}).
		state('createArticle', {
			url: '/articles/create',
			templateUrl: 'modules/articles/views/create-article.client.view.html'
		}).
		state('viewArticle', {
			url: '/articles/:articleId',
			templateUrl: 'modules/articles/views/view-article.client.view.html'
		}).
		state('editArticle', {
			url: '/articles/:articleId/edit',
			templateUrl: 'modules/articles/views/edit-article.client.view.html'
		});
	}
]);
'use strict';

angular.module('articles').controller('ArticlesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Articles',
	function($scope, $stateParams, $location, Authentication, Articles) {
		$scope.authentication = Authentication;

		$scope.create = function() {
			var article = new Articles({
				title: this.title,
				content: this.content
			});
			article.$save(function(response) {
				$location.path('articles/' + response._id);

				$scope.title = '';
				$scope.content = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.remove = function(article) {
			if (article) {
				article.$remove();

				for (var i in $scope.articles) {
					if ($scope.articles[i] === article) {
						$scope.articles.splice(i, 1);
					}
				}
			} else {
				$scope.article.$remove(function() {
					$location.path('articles');
				});
			}
		};

		$scope.update = function() {
			var article = $scope.article;

			article.$update(function() {
				$location.path('articles/' + article._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.find = function() {
			$scope.articles = Articles.query();
		};

		$scope.findOne = function() {
			$scope.article = Articles.get({
				articleId: $stateParams.articleId
			});
		};
	}
]);
'use strict';

//Articles service used for communicating with the articles REST endpoints
angular.module('articles').factory('Articles', ['$resource',
	function($resource) {
		return $resource('articles/:articleId', {
			articleId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
'use strict';

// Configuring the Articles module
//angular.module('bands').run(['Menus',
//	function(Menus) {
		// Set top bar menu items
//		Menus.addMenuItem('topbar', 'Bands', 'bands', 'dropdown', '/bands(/create)?');
//		Menus.addSubMenuItem('topbar', 'bands', 'List Bands', 'bands');
//		Menus.addSubMenuItem('topbar', 'bands', 'New Band', 'bands/create');
//	}
//]);
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
'use strict';

// Bands controller
angular.module('bands').controller('BandsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Bands','$http', 
	function($scope, $stateParams, $location, Authentication, Bands, $http) {
		$scope.authentication = Authentication;
		
		$scope.usersList = [];
		
		/*------------------------------
		ADD Member TypeAhead
		--------------------------------*/
		//When selected user from list
	 	$scope.onSelect = function ($item, $model, $label) {
	    	$scope.selectedMemberID = $item; 
		};
		
		//seach with typeahead musixmatch
		$scope.searchUsers = function(val) {
		    return $http.get('searchMembers', {params: { search: val, sensor: false}
		    }).then(function(response){
			      	return response.data.map(function(item){
			        	return item;
			     });
		    });
		};
		
		

		//add  music  from musixmatch
	 	$scope.addMember = function () {
	   		var memberID =  $scope.selectedMemberID;
			
			//$scope.selectedMemberID = null;
			$scope.error = null; 
			$scope.asyncSelected = null;
			
			$scope.band.members.push({'admin':0, 'member':memberID} );
			$scope.update();
		};

		
		// Create new Band
		$scope.create = function() {
			// Create new Band object
			var band = new Bands ({
				name: this.name
			});

			// Redirect after save
			band.$save(function(response) {
				$location.path('bands/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Band
		$scope.remove = function(band) {
			if ( band ) { 
				band.$remove();

				for (var i in $scope.bands) {
					if ($scope.bands [i] === band) {
						$scope.bands.splice(i, 1);
					}
				}
			} else {
				$scope.band.$remove(function() {
					$location.path('bands');
				});
			}
		};

		// Update existing Band
		$scope.update = function() {
			var band = $scope.band;

			band.$update(function() {
				$location.path('bands/' + band._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Bands
		$scope.find = function() {
			$scope.bands = Bands.query();
		};

		// Find existing Band
		$scope.findOne = function() {
			$scope.band = Bands.get({ 
				bandId: $stateParams.bandId
			});
			
			console.log($scope.band);
		};
	}
]);
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
'use strict';

// Setting up route
angular.module('core').config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {
		// Redirect to home view when route not found
		$urlRouterProvider.otherwise('/');

		// Home state routing
		$stateProvider.
		state('home', {
			url: '/',
			templateUrl: 'modules/core/views/home.client.view.html'
		});
	}
]);
'use strict';

angular.module('core').controller('HeaderController', ['$scope', 'Authentication', 'Menus', 
	function($scope, Authentication, Menus) {
		$scope.authentication = Authentication;
		$scope.isCollapsed = false;
		$scope.menu = Menus.getMenu('topbar');

		$scope.toggleCollapsibleMenu = function() {
			$scope.isCollapsed = !$scope.isCollapsed;
		};

		// Collapsing the menu after navigation
		$scope.$on('$stateChangeSuccess', function() {
			$scope.isCollapsed = false;
		});
		
			
	}
]);
'use strict';


angular.module('core').controller('HomeController', ['$scope', 'Authentication',
	function($scope, Authentication) {
		// This provides Authentication context.
		$scope.authentication = Authentication;
	}
]);
'use strict';

//Menu service used for managing  menus
angular.module('core').service('Menus', [

	function() {
		// Define a set of default roles
		this.defaultRoles = ['*'];

		// Define the menus object
		this.menus = {};

		// A private function for rendering decision 
		var shouldRender = function(user) {
			if (user) {
				if (!!~this.roles.indexOf('*')) {
					return true;
				} else {
					for (var userRoleIndex in user.roles) {
						for (var roleIndex in this.roles) {
							if (this.roles[roleIndex] === user.roles[userRoleIndex]) {
								return true;
							}
						}
					}
				}
			} else {
				return this.isPublic;
			}

			return false;
		};

		// Validate menu existance
		this.validateMenuExistance = function(menuId) {
			if (menuId && menuId.length) {
				if (this.menus[menuId]) {
					return true;
				} else {
					throw new Error('Menu does not exists');
				}
			} else {
				throw new Error('MenuId was not provided');
			}

			return false;
		};

		// Get the menu object by menu id
		this.getMenu = function(menuId) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Return the menu object
			return this.menus[menuId];
		};

		// Add new menu object by menu id
		this.addMenu = function(menuId, isPublic, roles) {
			// Create the new menu
			this.menus[menuId] = {
				isPublic: isPublic || false,
				roles: roles || this.defaultRoles,
				items: [],
				shouldRender: shouldRender
			};

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeMenu = function(menuId) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Return the menu object
			delete this.menus[menuId];
		};

		// Add menu item object
		this.addMenuItem = function(menuId, menuItemTitle, menuItemURL, menuItemType, menuItemUIRoute, isPublic, roles, position) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Push new menu item
			this.menus[menuId].items.push({
				title: menuItemTitle,
				link: menuItemURL,
				menuItemType: menuItemType || 'item',
				menuItemClass: menuItemType,
				uiRoute: menuItemUIRoute || ('/' + menuItemURL),
				isPublic: ((isPublic === null || typeof isPublic === 'undefined') ? this.menus[menuId].isPublic : isPublic),
				roles: ((roles === null || typeof roles === 'undefined') ? this.menus[menuId].roles : roles),
				position: position || 0,
				items: [],
				shouldRender: shouldRender
			});

			// Return the menu object
			return this.menus[menuId];
		};

		// Add submenu item object
		this.addSubMenuItem = function(menuId, rootMenuItemURL, menuItemTitle, menuItemURL, menuItemUIRoute, isPublic, roles, position) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item
			for (var itemIndex in this.menus[menuId].items) {
				if (this.menus[menuId].items[itemIndex].link === rootMenuItemURL) {
					// Push new submenu item
					this.menus[menuId].items[itemIndex].items.push({
						title: menuItemTitle,
						link: menuItemURL,
						uiRoute: menuItemUIRoute || ('/' + menuItemURL),
						isPublic: ((isPublic === null || typeof isPublic === 'undefined') ? this.menus[menuId].items[itemIndex].isPublic : isPublic),
						roles: ((roles === null || typeof roles === 'undefined') ? this.menus[menuId].items[itemIndex].roles : roles),
						position: position || 0,
						shouldRender: shouldRender
					});
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeMenuItem = function(menuId, menuItemURL) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item to remove
			for (var itemIndex in this.menus[menuId].items) {
				if (this.menus[menuId].items[itemIndex].link === menuItemURL) {
					this.menus[menuId].items.splice(itemIndex, 1);
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeSubMenuItem = function(menuId, submenuItemURL) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item to remove
			for (var itemIndex in this.menus[menuId].items) {
				for (var subitemIndex in this.menus[menuId].items[itemIndex].items) {
					if (this.menus[menuId].items[itemIndex].items[subitemIndex].link === submenuItemURL) {
						this.menus[menuId].items[itemIndex].items.splice(subitemIndex, 1);
					}
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		//Adding the topbar menu
		this.addMenu('topbar');
	}
]);
'use strict';

// Configuring the Articles module
//angular.module('setlists').run(['Menus',
//	function(Menus) {
		// Set top bar menu items
		//Menus.addMenuItem('topbar', 'Setlists', 'setlists', 'dropdown', '/setlists(/create)?');
		//Menus.addSubMenuItem('topbar', 'setlists', 'List Setlists', 'setlists');
		//Menus.addSubMenuItem('topbar', 'setlists', 'New Setlist', 'setlists/create');
//		Menus.addMenuItem('topbar', 'Setlists', 'setlists',  'setlists');
//	}
//]);
'use strict';

//Setting up route
angular.module('setlists').config(['$stateProvider',
	function($stateProvider) {
		// Setlists state routing
		$stateProvider.
		state('listSetlists', {
			url: '/setlists',
			templateUrl: 'modules/setlists/views/list-setlists.client.view.html'
		}).
		state('createSetlist', {
			url: '/setlists/create',
			templateUrl: 'modules/setlists/views/create-setlist.client.view.html'
		}).
		state('viewSetlist', {
			url: '/setlists/:setlistId',
			templateUrl: 'modules/setlists/views/view-setlist.client.view.html'
		}).
		state('editSetlist', {
			url: '/setlists/:setlistId/edit',
			templateUrl: 'modules/setlists/views/edit-setlist.client.view.html'
		});
	}
]);
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
'use strict';

// Configuring the Articles module
angular.module('songs').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Repertoire', 'songs', 'dropdown', 'songs');
		//Menus.addSubMenuItem('topbar', 'songs', 'List Songs', 'songs');
		//Menus.addSubMenuItem('topbar', 'songs', 'New Song', 'songs/create');
		Menus.addSubMenuItem('topbar', 'songs', 'Songs',   'songs');
		Menus.addSubMenuItem('topbar', 'songs', 'Setlists', 'setlists');
	}
]);




'use strict';

//Setting up route
angular.module('songs').config(['$stateProvider',
	function($stateProvider) {
		// Songs state routing
		$stateProvider.
		state('listSongs', {
			url: '/songs',
			templateUrl: 'modules/songs/views/list-songs.client.view.html'
		}).
		state('createSong', {
			url: '/songs/create',
			templateUrl: 'modules/songs/views/create-song.client.view.html'
		}).
		state('viewSong', {
			url: '/songs/:songId',
			templateUrl: 'modules/songs/views/view-song.client.view.html'
		}).
		state('editSong', {
			url: '/songs/:songId/edit',
			templateUrl: 'modules/songs/views/edit-song.client.view.html'
		});
	}
]);
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
'use strict';

// Config HTTP Error Handling
angular.module('users').config(['$httpProvider',
	function($httpProvider) {
		// Set the httpProvider "not authorized" interceptor
		$httpProvider.interceptors.push(['$q', '$location', 'Authentication',
			function($q, $location, Authentication) {
				return {
					responseError: function(rejection) {
						switch (rejection.status) {
							case 401:
								// Deauthenticate the global user
								Authentication.user = null;

								// Redirect to signin page
								$location.path('signin');
								break;
							case 403:
								// Add unauthorized behaviour 
								break;
						}

						return $q.reject(rejection);
					}
				};
			}
		]);
	}
]);
'use strict';

// Setting up route
angular.module('users').config(['$stateProvider',
	function($stateProvider) {
		// Users state routing
		$stateProvider.
		state('profile', {
			url: '/settings/profile',
			templateUrl: 'modules/users/views/settings/edit-profile.client.view.html'
		}).
		state('password', {
			url: '/settings/password',
			templateUrl: 'modules/users/views/settings/change-password.client.view.html'
		}).
		state('accounts', {
			url: '/settings/accounts',
			templateUrl: 'modules/users/views/settings/social-accounts.client.view.html'
		}).
		state('signup', {
			url: '/signup',
			templateUrl: 'modules/users/views/authentication/signup.client.view.html'
		}).
		state('signin', {
			url: '/signin',
			templateUrl: 'modules/users/views/authentication/signin.client.view.html'
		}).
		state('forgot', {
			url: '/password/forgot',
			templateUrl: 'modules/users/views/password/forgot-password.client.view.html'
		}).
		state('reset-invalid', {
			url: '/password/reset/invalid',
			templateUrl: 'modules/users/views/password/reset-password-invalid.client.view.html'
		}).
		state('reset-success', {
			url: '/password/reset/success',
			templateUrl: 'modules/users/views/password/reset-password-success.client.view.html'
		}).
		state('reset', {
			url: '/password/reset/:token',
			templateUrl: 'modules/users/views/password/reset-password.client.view.html'
		});
	}
]);
'use strict';

angular.module('users').controller('AuthenticationController', ['$scope', '$http', '$location', 'Authentication',
	function($scope, $http, $location, Authentication) {
		$scope.authentication = Authentication;

		// If user is signed in then redirect back home
		if ($scope.authentication.user) $location.path('/');

		$scope.signup = function() {
			$http.post('/auth/signup', $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				$scope.authentication.user = response;

				// And redirect to the index page
				$location.path('/');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

		$scope.signin = function() {
			$http.post('/auth/signin', $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				$scope.authentication.user = response;

				// And redirect to the index page
				$location.path('/');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);
'use strict';

angular.module('users').controller('PasswordController', ['$scope', '$stateParams', '$http', '$location', 'Authentication',
	function($scope, $stateParams, $http, $location, Authentication) {
		$scope.authentication = Authentication;

		//If user is signed in then redirect back home
		if ($scope.authentication.user) $location.path('/');

		// Submit forgotten password account id
		$scope.askForPasswordReset = function() {
			$scope.success = $scope.error = null;

			$http.post('/auth/forgot', $scope.credentials).success(function(response) {
				// Show user success message and clear form
				$scope.credentials = null;
				$scope.success = response.message;

			}).error(function(response) {
				// Show user error message and clear form
				$scope.credentials = null;
				$scope.error = response.message;
			});
		};

		// Change user password
		$scope.resetUserPassword = function() {
			$scope.success = $scope.error = null;

			$http.post('/auth/reset/' + $stateParams.token, $scope.passwordDetails).success(function(response) {
				// If successful show success message and clear form
				$scope.passwordDetails = null;

				// Attach user profile
				Authentication.user = response;

				// And redirect to the index page
				$location.path('/password/reset/success');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);
'use strict';

angular.module('users').controller('SettingsController', ['$scope', '$http', '$location', 'Users', 'Authentication', '$mdDialog', 
	function($scope, $http, $location, Users, Authentication, $mdDialog) {
		$scope.user = Authentication.user;

		//slides help
		var slides = $scope.slides = ["01.png"];

		// If user is not signed in then redirect back home
		if (!$scope.user) $location.path('/');

		// Check if there are additional accounts 
		$scope.hasConnectedAdditionalSocialAccounts = function(provider) {
			for (var i in $scope.user.additionalProvidersData) {
				return true;
			}

			return false;
		};

		// Check if provider is already in use with current user
		$scope.isConnectedSocialAccount = function(provider) {
			return $scope.user.provider === provider || ($scope.user.additionalProvidersData && $scope.user.additionalProvidersData[provider]);
		};

		// Remove a user social account
		$scope.removeUserSocialAccount = function(provider) {
			$scope.success = $scope.error = null;

			$http.delete('/users/accounts', {
				params: {
					provider: provider
				}
			}).success(function(response) {
				// If successful show success message and clear form
				$scope.success = true;
				$scope.user = Authentication.user = response;
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

		// Update a user profile
		$scope.updateUserProfile = function(isValid) {
			if (isValid) {
				$scope.success = $scope.error = null;
				var user = new Users($scope.user);

				user.$update(function(response) {
					$scope.success = true;
					Authentication.user = response;
				}, function(response) {
					$scope.error = response.data.message;
				});
			} else {
				$scope.submitted = true;
			}
		};

		// Change user password
		$scope.changeUserPassword = function() {
			$scope.success = $scope.error = null;

			$http.post('/users/password', $scope.passwordDetails).success(function(response) {
				// If successful show success message and clear form
				$scope.success = true;
				$scope.passwordDetails = null;
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
		
		
		
		/*---------------------------------------------
		DIALOG LIST SONG
		----------------------------------------------*/
		$scope.showHelp = function (ev) {
			
			if (!$scope.user.showHelp && $scope.user){
				
				$mdDialog.show({
				  controller: UserDialogController,
				  templateUrl: 'modalHelp.tmpl.html',
				  parent: angular.element(document.body), 
				  targetEvent: ev,
				})
				.then(function(response) {
				   
					if (response){
						$scope.user.showHelp = true;	
						$scope.updateUserProfile(true);
					}
				
				}, function() {
				  $scope.alert = 'You cancelled the dialog.';
				});
			}
		};
		
		
	}
]);

function UserDialogController($scope, $mdDialog) {
  
  $scope.hide = function() {
    $mdDialog.hide();
  };
  $scope.cancel = function() {
    $mdDialog.cancel();
  };
  
  $scope.modalShow = function(value){
	 $mdDialog.hide(true);
  };
  		
}

'use strict';

// Authentication service for user variables
angular.module('users').factory('Authentication', [
	function() {
		var _this = this;

		_this._data = {
			user: window.user
		};

		return _this._data;
	}
]);
'use strict';

// Users service used for communicating with the users REST endpoint
angular.module('users').factory('Users', ['$resource',
	function($resource) {
		return $resource('users', {}, {
			update: {
				method: 'PUT'
			}
		});
	}
]).directive('disableAnimation', ["$animate", function($animate){
    return {
        restrict: 'A',
        link: function($scope, $element, $attrs){
            $attrs.$observe('disableAnimation', function(value){
                $animate.enabled(!value, $element);
            });
        }
    }
}]);