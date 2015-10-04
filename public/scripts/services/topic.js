(function() {
  'use strict';
  angular
  .module('MyApp')
  .factory('Topic', Topic);

  function Topic($http) {
    var service = {
      getAll : getAll,
      getTopicBySlug: getTopicBySlug,
      getMovieBySlug: getMovieBySlug,
    }

    return service;

    ///////////////////
    function getAll() {
      return $http.get('/api/topics').then(function(result) {
        return result.data;
      }, function(reason){
        return reason.data;
      });
    };

    function getTopicBySlug(slug) {
      return $http.get('/api/topics/s/' + slug).then(function(result) {
        return result.data;
      }, function(reason){
        return reason.data;
      })
    };

    function getMovieBySlug(slug) {
      return $http.get('/api/movies/s/' + slug).then(function(result) {
        return result.data;
      }, function(reason){
        return reason.data;
      });
    };
  }

})();