describe('Router', function() {
	beforeEach(function() {
		module('EventRouter');
	});

	it('should map routes to controllers', function() {
		inject(function($route) {
			expect($route.routes['/events/all'].controller).toBe('EventsAllController');
			expect($route.routes['/events/upcoming'].controller).toBe('EventsGroupController');
			expect($route.routes['/events/local'].controller).toBe('EventsGroupController');
		});
	});

	it('should map routes to correct templates', function() {
		inject(function($route) {
			expect($route.routes['/events/all'].templateUrl).toEqual('javascripts/templates/events-all.html');
			expect($route.routes['/events/upcoming'].templateUrl).toEqual('javascripts/templates/events-grouped.html');
			expect($route.routes['/events/local'].templateUrl).toEqual('javascripts/templates/events-grouped.html');
		});
	});

	it('should redirect to #/events/all if no path is given', function() {
		inject(function($route) {
			expect($route.routes[null].redirectTo).toEqual('/events/all');
		});
	});
})