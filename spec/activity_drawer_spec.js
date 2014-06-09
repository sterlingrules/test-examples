describe('Activity Drawer', function() {

	beforeEach(function() {
		this.addMatchers({
			toEqualData: function(expected) {
				return angular.equals(this.actual, expected);
			}
		});
	});

	beforeEach(module('HvstApp'));

	describe('Activity type for position', function() {
		var scope, ctrl, $httpBackend;
		beforeEach(inject(function(_$httpBackend_, $rootScope, $controller) {
			$httpBackend = _$httpBackend_;
			$httpBackend.expectGET('https://hvst.com/activities.json').
				respond([{
					current_user_id: 570,
					action: "upgraded",
					avatar_url: "https://s3.amazonaws.com/assets.staging.hvst.com/uploads/user/avatar/570/foursquare_md.jpg",
					full_name: "Leslie Knope",
					actor_id: 830,
					profile_url: "/830-leslie-knope",
					subject_type: "Post",
					subject_id: 1,
					subject_user_id: 303,
					post: {
						id: 1,
						user_id: 570,
						content: 'Lorem Ipsum'
					},
					position: {
						stock: 'AAPL',
						entry_size_percentage: 1,
						recommendation_cd: 0
					},
					portfolio: {
						fund_name: 'Awesome'
					}
				}]);

			scope = $rootScope.$new();
			ctrl = $controller('ActivityController', { $scope: scope });
		}));

		it('Should create an "activity" model for positions fetched from XHR', function() {
			$httpBackend.flush();
			expect(scope.activities)
				.toEqualData([{
					// With position
					current_user_id:570,
					action:'upgraded',
					avatar_url:'https://s3.amazonaws.com/assets.staging.hvst.com/uploads/user/avatar/570/foursquare_md.jpg',
					full_name:'Leslie Knope',
					actor_id:830,
					profile_url:'/830-leslie-knope',
					subject_type:'Post',
					subject_id:1,
					subject_user_id:303,
					post:{
						id:1,
						user_id:570,
						content:'Lorem Ipsum'
					},
					position:{
						stock:'AAPL',
						entry_size_percentage:1,
						recommendation_cd:0
					},
					portfolio:{
						fund_name:'Awesome'
					},
					read:true,
					message:' <a href="/post/content/1">&ldquo;Lorem Ipsum &rdquo;</a> '
				}]);
		});
	});

	describe('Activity type for post with title', function() {
		var scope, ctrl, $httpBackend;
		beforeEach(inject(function(_$httpBackend_, $rootScope, $controller) {
			$httpBackend = _$httpBackend_;
			$httpBackend.expectGET('/activities.json').
				respond([{
				    current_user_id: 830,
				    action: "upgraded",
				    avatar_url: "https://s3.amazonaws.com/assets.staging.hvst.com/uploads/user/avatar/570/foursquare_md.jpg",
				    full_name: "Sterling Salzberg",
				    actor_id: 570,
				    profile_url: "/570-sterling-salzberg",
				    subject_type: "Post",
				    subject_id: 2,
				    subject_user_id: 303,
				    post: {
				        id: 2,
				        title: 'This is a Title',
				        content: 'Lorem Ipsum',
				        user_id: 570
				    }
				}]);

			scope = $rootScope.$new();
			ctrl = $controller('ActivityController', { $scope: scope });
		}));

		it('Should create an "activity" model for post with title fetched from XHR', function() {
			$httpBackend.flush();
			expect(scope.activities)
				.toEqualData([{
				    current_user_id:830,
				    action:'upgraded',
				    avatar_url:'https://s3.amazonaws.com/assets.staging.hvst.com/uploads/user/avatar/570/foursquare_md.jpg',
				    full_name:'Sterling Salzberg',
				    actor_id:570,
				    profile_url:'/570-sterling-salzberg',
				    subject_type:'Post',
				    subject_id:2,
				    subject_user_id:303,
				    post:{
				        id:2,
				        title:'This is a Title',
				        content:'Lorem Ipsum',
				        user_id:570
				    },
				    read:true,
				    message:' <a href="/post/content/2">&ldquo;This is a Title&rdquo;</a> '
				}]);
		});
	});

	describe('Activity type for post without title', function() {
		var scope, ctrl, $httpBackend;
		beforeEach(inject(function(_$httpBackend_, $rootScope, $controller) {
			$httpBackend = _$httpBackend_;
			$httpBackend.expectGET('/activities.json').
				respond([{
				    current_user_id: 830,
				    action: "upgraded",
				    avatar_url: "https://s3.amazonaws.com/assets.staging.hvst.com/uploads/user/avatar/570/foursquare_md.jpg",
				    full_name: "Sterling Salzberg",
				    actor_id: 570,
				    profile_url: "/570-sterling-salzberg",
				    subject_type: "Post",
				    subject_id: 3,
				    subject_user_id: 303,
				    post: {
				        id: 3,
				        title: null,
				        content: 'Lorem Ipsum',
				        user_id: 570
				    }
				}]);

			scope = $rootScope.$new();
			ctrl = $controller('ActivityController', { $scope: scope });
		}));

		it('Should create an "activity" model for post without title fetched from XHR', function() {
			$httpBackend.flush();
			expect(scope.activities)
				.toEqualData([{
				    current_user_id:830,
				    action:'upgraded',
				    avatar_url:'https://s3.amazonaws.com/assets.staging.hvst.com/uploads/user/avatar/570/foursquare_md.jpg',
				    full_name:'Sterling Salzberg',
				    actor_id:570,
				    profile_url:'/570-sterling-salzberg',
				    subject_type:'Post',
				    subject_id:3,
				    subject_user_id:303,
				    post:{
				        id:3,
				        title:null,
				        content:'Lorem Ipsum',
				        user_id:570
				    },
				    read:true,
				    message:' <a href="/post/content/3">&ldquo;Lorem Ipsum &rdquo;</a> '
				}]);
		});
	});

	describe('Activity type for following current user', function() {
		var scope, ctrl, $httpBackend;
		beforeEach(inject(function(_$httpBackend_, $rootScope, $controller) {
			$httpBackend = _$httpBackend_;
			$httpBackend.expectGET('/activities.json').
				respond([{
				    current_user_id: 570,
				    action: "followed",
				    avatar_url: "https://s3.amazonaws.com/assets.staging.hvst.com/uploads/user/avatar/830/fry_leela.jpg",
				    full_name: "Leslie Knope",
				    actor_id: 830,
				    profile_url: "/830-leslie-knope",
				    subject_type: "User",
				    subject_id: 570,
				    subject_name: "Sterling Salzberg"
				}]);

			scope = $rootScope.$new();
			ctrl = $controller('ActivityController', { $scope: scope });
		}));

		it('Should create an "activity" model for following current user fetched from XHR', function() {
			$httpBackend.flush();
			expect(scope.activities)
				.toEqualData([{
				    // Followed current user
				    current_user_id:570,
				    action:'followed',
				    avatar_url:'https://s3.amazonaws.com/assets.staging.hvst.com/uploads/user/avatar/830/fry_leela.jpg',
				    full_name:'Leslie Knope',
				    actor_id:830,
				    profile_url:'/830-leslie-knope',
				    subject_type:'User',
				    subject_id:570,
				    subject_name:'Sterling Salzberg',
				    read:true,
				    message:'you'
				}]);
		});
	});

	describe('Activity type for following another user', function() {
		var scope, ctrl, $httpBackend;
		beforeEach(inject(function(_$httpBackend_, $rootScope, $controller) {
			$httpBackend = _$httpBackend_;
			$httpBackend.expectGET('/activities.json').
				respond([{
				    current_user_id: 830,
				    action: "followed",
				    avatar_url: "https://s3.amazonaws.com/assets.staging.hvst.com/uploads/user/avatar/570/foursquare_md.jpg",
				    full_name: "Sterling Salzberg",
				    profile_url: "/570-sterling-salzberg",
				    subject_id: 767,
				    subject_type: "User",
				    subject_name: "Steven Tananbaum"
				}]);

			scope = $rootScope.$new();
			ctrl = $controller('ActivityController', { $scope: scope });
		}));

		it('Should create an "activity" model for following another user fetched from XHR', function() {
			$httpBackend.flush();
			expect(scope.activities)
				.toEqualData([{
				    current_user_id:830,
				    action:'followed',
				    avatar_url:'https://s3.amazonaws.com/assets.staging.hvst.com/uploads/user/avatar/570/foursquare_md.jpg',
				    full_name:'Sterling Salzberg',
				    profile_url:'/570-sterling-salzberg',
				    subject_id:767,
				    subject_type:'User',
				    subject_name:'Steven Tananbaum',
				    read:true,
				    message:'<a href="/767">Steven Tananbaum</a>'
				}]);
		});
	});
});
