(function() {
	var app = angular.module('EventControllers', [ 'EventFilters' ]);

	app.controller('EventsAllController', [ '$scope', function($scope) {
		$scope.events = [];
		
		$scope.onSuccess = function(data) {
			$scope.events = data;
			$scope.$apply();
		};
		$scope.onError = function(data) {
			$scope.events = data;
		};

		return VividSeats.eventService.all($scope.onSuccess, $scope.onError);
	}]);

	app.controller('EventsGroupController', [ '$scope', '$filter', function($scope, $filter) {
		$scope.events = [];
		$scope.filtered = [];
		$scope.index = [];

		$scope.onSuccess = function(data) {
			$scope.events = data;
			for(var i = 0; i < data.length; i++) {
				$scope.cities = $filter('groupEvents')(data[i].venue.city);
			}
			$scope.$apply();
		};
		$scope.onError = function(data) {
			$scope.events = data;
		};

		return VividSeats.eventService.all($scope.onSuccess, $scope.onError);
	}]);

})();