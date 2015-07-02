'use strict';

// Configuring the Articles module
angular.module('setlists').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		//Menus.addMenuItem('topbar', 'Setlists', 'setlists', 'dropdown', '/setlists(/create)?');
		//Menus.addSubMenuItem('topbar', 'setlists', 'List Setlists', 'setlists');
		//Menus.addSubMenuItem('topbar', 'setlists', 'New Setlist', 'setlists/create');
		Menus.addMenuItem('topbar', 'Setlists', 'setlists',  'setlists');
	}
]);