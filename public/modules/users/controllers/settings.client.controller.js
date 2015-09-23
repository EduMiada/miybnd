'use strict';

angular.module('users').controller('SettingsController', ['$scope', '$rootScope', '$http', '$location', 'Users', 'Authentication', '$mdDialog', 
	function($scope,$rootScope, $http, $location, Users, Authentication, $mdDialog) {
		$scope.user = Authentication.user;
		$scope.bands = [];
	
		
		//slides help
		var slides = $scope.slides = ["01.png"];

		// If user is not signed in then redirect back home
		if (!$scope.user) $location.path('/');

		//$scope.loadBands();
		//LOAD USER´s BANDS
		// Change user password
		$scope.loadBands = function() {
			$http.get('/users/' + $scope.user._id + '/bands').success(function(response) {
				$scope.bands = response;
			}).error(function(response) {
				$scope.error = response.message;
			});
		};


		// Check if there are additional accounts 
		$scope.hasConnectedAdditionalSocialAccounts = function(provider) {
			for (var i in $scope.user.additionalProvidersData) {
				return true;
			}

			return false;
		};

		// Check if provider is already in use with current user
		$scope.isConnectedSocialAccount = function(provider) {
			
			//alert($scope.user.additionalProvidersData[provider]);
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
				$rootScope.$broadcast('changeUserSelectedBand', Authentication);		
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

		// Update a user profile
		$scope.updateUserProfile = function(isValid) {
			if (isValid) {
				$scope.success = $scope.error = null;
				var user = new Users($scope.user);
				//user.selectedBand = $scope.selectedBand._id;
				user.$update(function(response) {
					$scope.success = true;
					$scope.user = Authentication.user = response;
					 $rootScope.$broadcast('changeUserSelectedBand', Authentication);					
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
//				$scope.success = true;
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
				  clickOutsideToClose: true,
				  escapeToClose: true,
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

		$scope.modalAvatar = function (ev) {
				$mdDialog.show({
				  clickOutsideToClose: true,
				  escapeToClose: true,
				  controller: UserDialogController,
				  templateUrl: 'modalUserAvatar.tmpl.html',
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
		};

		
		
	}
]);


function UserDialogController($scope, $mdDialog, Upload, $timeout) {
  
  $scope.hide = function() {
    $mdDialog.hide();
  };
  $scope.cancel = function() {
    $mdDialog.cancel();
  };
  
  $scope.modalShow = function(value){
	 $mdDialog.hide(true);
  };

  $scope.uploadFiles = function(file) {
        $scope.f = file;
        if (file && !file.$error) {
            file.upload = Upload.upload({
                url: 'https://angular-file-upload-cors-srv.appspot.com/upload',
                file: file
            });

            file.upload.then(function (response) {
                $timeout(function () {
                    file.result = response.data;
                });
            }, function (response) {
                if (response.status > 0)
                    $scope.errorMsg = response.status + ': ' + response.data;
            });

            file.upload.progress(function (evt) {
                file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
            });
        }   
    }

  		
}
