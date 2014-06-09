var HvstApp = angular.module('HvstApp', [
    'ngSanitize',
    'ActivityService'
]).config(function($sceDelegateProvider) {
  $sceDelegateProvider.resourceUrlWhitelist([
    // Allow same origin resource loads.
    'self',
    // Allow loading from our assets domain.
    'http://d2s4v4feh4cm39.cloudfront.net/assets/**',
    'https://d10y5jcdq4rel0.cloudfront.net/assets/**'
    ]);
  });
