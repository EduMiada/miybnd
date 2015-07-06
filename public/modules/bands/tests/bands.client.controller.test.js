'use strict';

(function() {
	// Bands Controller Spec
	describe('Bands Controller Tests', function() {
		// Initialize global variables
		var BandsController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Bands controller.
			BandsController = $controller('BandsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Band object fetched from XHR', inject(function(Bands) {
			// Create sample Band using the Bands service
			var sampleBand = new Bands({
				name: 'New Band'
			});

			// Create a sample Bands array that includes the new Band
			var sampleBands = [sampleBand];

			// Set GET response
			$httpBackend.expectGET('bands').respond(sampleBands);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.bands).toEqualData(sampleBands);
		}));

		it('$scope.findOne() should create an array with one Band object fetched from XHR using a bandId URL parameter', inject(function(Bands) {
			// Define a sample Band object
			var sampleBand = new Bands({
				name: 'New Band'
			});

			// Set the URL parameter
			$stateParams.bandId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/bands\/([0-9a-fA-F]{24})$/).respond(sampleBand);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.band).toEqualData(sampleBand);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Bands) {
			// Create a sample Band object
			var sampleBandPostData = new Bands({
				name: 'New Band'
			});

			// Create a sample Band response
			var sampleBandResponse = new Bands({
				_id: '525cf20451979dea2c000001',
				name: 'New Band'
			});

			// Fixture mock form input values
			scope.name = 'New Band';

			// Set POST response
			$httpBackend.expectPOST('bands', sampleBandPostData).respond(sampleBandResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Band was created
			expect($location.path()).toBe('/bands/' + sampleBandResponse._id);
		}));

		it('$scope.update() should update a valid Band', inject(function(Bands) {
			// Define a sample Band put data
			var sampleBandPutData = new Bands({
				_id: '525cf20451979dea2c000001',
				name: 'New Band'
			});

			// Mock Band in scope
			scope.band = sampleBandPutData;

			// Set PUT response
			$httpBackend.expectPUT(/bands\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/bands/' + sampleBandPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid bandId and remove the Band from the scope', inject(function(Bands) {
			// Create new Band object
			var sampleBand = new Bands({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Bands array and include the Band
			scope.bands = [sampleBand];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/bands\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleBand);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.bands.length).toBe(0);
		}));
	});
}());