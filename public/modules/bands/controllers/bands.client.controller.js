'use strict';

// Bands controller
angular.module('bands').controller('BandsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Bands',
	function($scope, $stateParams, $location, Authentication, Bands) {
		$scope.authentication = Authentication;

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
		};
	}
]);