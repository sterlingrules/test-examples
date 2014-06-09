angular.module('ActivityService', [ 'ngResource' ])
 
	.factory('Activity',
		[
			'$resource',

		function($resource) {
			return $resource('/activities.json', {}, {
				query: { method: 'GET', params: {}, isArray: true }
			});
		}]
	);