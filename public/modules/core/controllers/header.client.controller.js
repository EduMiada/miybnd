'use strict';

angular.module('core').controller('HeaderController', ['$scope', 'Authentication', 'Menus', '$http','Users','$location',
	function($scope, Authentication, Menus, $http, Users, $location) {
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
	
		// Userchanged
		$scope.$on('changeUserSelectedBand', function(auth) {
			$scope.authentication = Authentication;
			//$scope.$apply();
		});
	
		// Check if provider is already in use with current user
		$scope.isConnectedSocialAccount = function(provider) {
			
			//alert($scope.user.additionalProvidersData[provider]);
			return $scope.authentication.user.provider === provider || ($scope.authentication.user.additionalProvidersData && $scope.authentication.user.additionalProvidersData[provider]);
		};
	
		$scope.updateSelectedBand = function(bandID) {

				//$scope.success = $scope.error = null;
				var user = new Users($scope.authentication.user);
				user.selectedBand._id = bandID;

				user.$update(function(response) {
					$scope.success = true;
					Authentication.user = response;
					$location.path('/');
				}, function(response) {
					$scope.error = response.data.message;
				});
		};
	
	
//		$scope.selectBand = function(bandID) {
			
//			alert($scope.credentials);
//				$http.post('/user/selectband/' +  $scope.authentication.user._id + '?bandID=' + bandID).success(function(response) {
				// If successful we assign the response to the global user model
//				$scope.authentication.user = response;

				// And redirect to the index page
//				$location.path('/');
//			}).error(function(response) {
//				$scope.error = response.message;
//			});
//		};
	}
	
	
]);