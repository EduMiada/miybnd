'use strict';

// Configuring the Articles module
angular.module('songs').run(['Menus',
	function(Menus) {

		Menus.addMenuItem('topbar', 'Songs', 'songs', 'songs');
		Menus.addMenuItem('topbar', 'Setlists', 'setlists', 'setlists');

		// Set top bar menu items
		//Menus.addMenuItem('topbar', 'Repertoire', 'songs', 'dropdown', 'songs');
		//Menus.addSubMenuItem('topbar', 'songs', 'List Songs', 'songs');
		//Menus.addSubMenuItem('topbar', 'songs', 'New Song', 'songs/create');
		//Menus.addSubMenuItem('topbar', 'songs', 'Songs',   'songs');
		//Menus.addSubMenuItem('topbar', 'songs', 'Setlists', 'setlists');
	}
]);



