(function() {
  'use strict';
  angular.module('MyApp')
  .factory('Topic', function($http) {
    return {
      getAll: function() {
        return $http.get('/api/topics').then(function(result) {
          return result.data;
        });
      },
      getTopicBySlug: function(slug) {
        return $http.get('/api/topics/s/' + slug).then(function(result) {
          return result.data;
        }, function(reason){
          return reason.data;
        });
      },
      getMovieBySlug: function(slug) {
        return $http.get('/api/movies/s/' + slug).then(function(result) {
          return result.data;
        }, function(reason){
          return reason.data;
        });
      }
    }
  });
})();