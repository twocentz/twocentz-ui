angular.module('MyApp')
  .factory('Topic', function($resource) {
    return $resource('/api/topics/:id');
  });