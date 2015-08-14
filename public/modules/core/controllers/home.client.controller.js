'use strict';


angular.module('core').controller('HomeController', ['$scope', 'Authentication',
	function($scope, Authentication) {
		// This provides Authentication context.
		$scope.authentication = Authentication;
		
		// Userchanged
		$scope.$on('changeUserSelectedBand', function(auth) {
			$scope.authentication = Authentication;
		});
	}
]);