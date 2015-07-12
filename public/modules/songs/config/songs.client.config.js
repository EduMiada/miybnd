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



