angular.module('MyApp')
  .factory('Entries', function($http) {
    return {
      getMovieEntryById: function(id) {
        return $http.get('/api/movies/entries/' + id).then(function(result) {
          return result.data;
        }, function(reason){
          return reason.data;
        });
      }
    }
  });