(function() {
  'use strict';
  angular
    .module('TwoCentzWeb')
    .factory('Topic', Topic);

    function Topic(CachedDataService) {
      var service = {
        getAll : getAll,
        getTopicBySlug: getTopicBySlug,
        getMovieBySlug: getMovieBySlug,
      }

      return service;

      ///////////////////
      function getAll() {
        return CachedDataService.getValue('/api/topics');
      };

      function getTopicBySlug(slug) {
        return CachedDataService.getValue('/api/topics/s/' + slug);
      };

      function getMovieBySlug(slug) {
        return CachedDataService.getValue('/api/movies/s/' + slug);
      };
  }

})();