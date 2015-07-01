angular.module('MyApp')
  .factory('Topic', function($http) {
    return {
      getAll: function() {
        return $http.get('/api/topics').then(function(result) {
          return result.data;
        });
      }
    }
  });