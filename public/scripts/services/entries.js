(function() {
  'use strict';

  /* @ngInject */
  function Entries(CachedDataService) {


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

    var service = {
      getMovieEntryById : getMovieEntryById,
      postMovieEntriesByTopicId: postMovieEntriesByTopicId,
      postUserTopicEntriesByTopicId: postUserTopicEntriesByTopicId
    };

    return service;
  }

  angular
    .module('TwoCentzWeb')
    .factory('Entries', Entries);
})();
