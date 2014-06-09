HvstApp
	.controller('ActivityController',
		[
			'$scope',
			'$http',
			'Activity',

		function($scope, $http, Activity) {

			var lastCheckTime = window.localStorage.getItem('checkTime') || null,
				notifyCount = null,
				getMsg = function(activity) {
						var msg = '',
							pronoun = (activity.current_user_id === activity.author_id) ? 'your' : '',
							myself = activity.current_user_id === activity.subject_id,
							action = ' ' + activity.action + ' ',
							author_name = (activity.author_name && pronoun === '') ? 'by <a href="' + activity.author_url + '">' + activity.author_name + '</a>' : '';

						if (activity.subject_type == 'Post') {
							if (activity.position && activity.portfolio && activity.action != "upgraded") {
								var stock = activity.position.stock,
									rec = [ 'LONG', 'SHORT' ],
									entry_size_percentage = activity.position.entry_size_percentage;
								msg =  pronoun + ' ' + entry_size_percentage + '% ' + rec[activity.position.recommendation_cd] + ' <a href="/search?query=' + stock + '&type=companies">' + stock + '</a> ' + author_name;
							} else {
								if (activity.post.title) {
									msg = pronoun + ' ' + '<a href="/post/content/' + activity.subject_id + '">&ldquo;' + activity.post.title + '&rdquo;</a> ' + author_name;
								} else {
									var truncate = 100,
										ellipsis = (activity.post.content.length > truncate) ? '...' : '';
									msg = pronoun + ' ' + '<a href="/post/content/' + activity.subject_id + '">&ldquo;' + activity.post.content.substring(0,truncate) + ' ' + ellipsis + '&rdquo;</a> ' + author_name;
								}
							}
						} else if (activity.subject_type === 'User' && !myself) {
							msg = '<a href="/' + activity.subject_id + '">' + activity.subject_name + '</a>';
						} else {
							msg = 'you';
						}

						return (activity.action == 'commented') ?  ' on ' + msg : msg;
					},
				setupActivities = function(data) {
						for (var i = 0; i < data.length; i++) {
							// Get notification count
							var notifyTime = new Date(data[i].created_at).getTime();
							if (notifyTime > lastCheckTime) {
								data[i].read = false;
								notifyCount++;
							} else {
								data[i].read = true;
							}
							data[i].message = getMsg(data[i]);
						}

						$scope.isActive = false;
						$scope.activities = data;

						$scope.count = notifyCount;
						$scope.active = 'fa fa-bell-o';
						if (notifyCount > 0) {
							$scope.active = 'active';
						}
					};

			Activity.query({}, setupActivities);

			$scope.getActivity = function() {
				var drawer = $('#drawer'),
					checkTime = new Date().getTime();

				$scope.active = 'fa fa-bell-o';
				$scope.count = null;
				$('input, textarea').placeholder();
				// $('#favicon_notify').clear();

				window.localStorage.setItem('checkTime',checkTime);

				if (drawer.hasClass('active')) {
					drawer.removeClass('active').addClass('fa fa-bell-o');
					$scope.isActive = false;
				} else {
					drawer.addClass('active').removeClass('fa fa-bell-o');
					$scope.isActive = true;
				}

				$(document).on('click', function(e) {
					if ($(e.target).closest('#activity_drawer').length == 0) {
						drawer.removeClass('active');
					}
				});
			};

		}]
	);
