(function() {
  'use strict';
  angular
    .module('TwoCentzWeb')
    .factory('Entries', Entries);
  /* @ngInject */
  function Entries(CachedDataService) {
    var service = {
      getMovieEntryById : getMovieEntryById,
      postMovieEntriesByTopicId: postMovieEntriesByTopicId
    };

    return service;

    function getMovieEntryById (id) {
        CachedDataService.getValue('/api/movies/entries/' + id);
    }

    function postMovieEntriesByTopicId(text, topicId){
      var postObject = {
                      text: text,
                      topicId: topicId
                    };
      return CachedDataService.postValue('api/entries/movies', postObject);
    }

    function postUserTopicEntriesByTopicId(text, topicId){
      var postObject = {
                      text: text,
                      topicId: topicId
                    };
      return CachedDataService.postValue('api/entries/usertopics', postObject);
    }

  }
})();
