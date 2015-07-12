'use strict';

angular.module('users').controller('SettingsController', ['$scope', '$http', '$location', 'Users', 'Authentication', '$mdDialog',
	function($scope, $http, $location, Users, Authentication, $mdDialog) {
		$scope.user = Authentication.user;

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
			
			if (!$scope.user.showHelp){
				
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