(function() {
	var app = angular.module('EventRouter', [
			'ngRoute',
			'EventControllers'
		]);

	app.config([ '$routeProvider',
		function($routeProvider) {
			$routeProvider
				.when('/events/all', {
					templateUrl: 'javascripts/templates/events-all.html',
					controller: 'EventsAllController'
				})
				.when('/events/upcoming', {
					templateUrl: 'javascripts/templates/events-grouped.html',
					controller: 'EventsGroupController'
				})
				.when('/events/local', {
					templateUrl: 'javascripts/templates/events-grouped.html',
					controller: 'EventsGroupController'
				})
				.otherwise({
					redirectTo: '/events/all'
				});
		}]);
})();