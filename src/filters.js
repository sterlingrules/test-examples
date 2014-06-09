(function() {
	var app = angular.module('EventFilters', []);

	app.filter('groupEvents', function() {
		var index = [];
		return function(city) {
			var sorted_events = index.indexOf(city) == -1;
	        if (sorted_events) index.push(city);
	        return index;
	    };
	});
})();