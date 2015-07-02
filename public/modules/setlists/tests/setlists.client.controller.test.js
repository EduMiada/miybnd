'use strict';

(function() {
	// Setlists Controller Spec
	describe('Setlists Controller Tests', function() {
		// Initialize global variables
		var SetlistsController,
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

			// Initialize the Setlists controller.
			SetlistsController = $controller('SetlistsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Setlist object fetched from XHR', inject(function(Setlists) {
			// Create sample Setlist using the Setlists service
			var sampleSetlist = new Setlists({
				name: 'New Setlist'
			});

			// Create a sample Setlists array that includes the new Setlist
			var sampleSetlists = [sampleSetlist];

			// Set GET response
			$httpBackend.expectGET('setlists').respond(sampleSetlists);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.setlists).toEqualData(sampleSetlists);
		}));

		it('$scope.findOne() should create an array with one Setlist object fetched from XHR using a setlistId URL parameter', inject(function(Setlists) {
			// Define a sample Setlist object
			var sampleSetlist = new Setlists({
				name: 'New Setlist'
			});

			// Set the URL parameter
			$stateParams.setlistId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/setlists\/([0-9a-fA-F]{24})$/).respond(sampleSetlist);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.setlist).toEqualData(sampleSetlist);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Setlists) {
			// Create a sample Setlist object
			var sampleSetlistPostData = new Setlists({
				name: 'New Setlist'
			});

			// Create a sample Setlist response
			var sampleSetlistResponse = new Setlists({
				_id: '525cf20451979dea2c000001',
				name: 'New Setlist'
			});

			// Fixture mock form input values
			scope.name = 'New Setlist';

			// Set POST response
			$httpBackend.expectPOST('setlists', sampleSetlistPostData).respond(sampleSetlistResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Setlist was created
			expect($location.path()).toBe('/setlists/' + sampleSetlistResponse._id);
		}));

		it('$scope.update() should update a valid Setlist', inject(function(Setlists) {
			// Define a sample Setlist put data
			var sampleSetlistPutData = new Setlists({
				_id: '525cf20451979dea2c000001',
				name: 'New Setlist'
			});

			// Mock Setlist in scope
			scope.setlist = sampleSetlistPutData;

			// Set PUT response
			$httpBackend.expectPUT(/setlists\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/setlists/' + sampleSetlistPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid setlistId and remove the Setlist from the scope', inject(function(Setlists) {
			// Create new Setlist object
			var sampleSetlist = new Setlists({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Setlists array and include the Setlist
			scope.setlists = [sampleSetlist];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/setlists\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleSetlist);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.setlists.length).toBe(0);
		}));
	});
}());