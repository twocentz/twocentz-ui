(function() {
  'use strict';
  angular
    .module('TwoCentzWeb')
    .factory('Entries', Entries);
    
  function Entries(CachedDataService) {
    var service = {
      getMovieEntryById : getMovieEntryById,
      postEntriesByTopicId:  postEntriesByTopicId
    };

    return service;

    function getMovieEntryById (id) {
        CachedDataService.getValue('/api/movies/entries/' + id);
    }

    function postEntriesByTopicId(text, topicId){
      var postObject = {
                      text: text,
                      topicId: topicId
                    };
      return CachedDataService.postValue('api/entries/movies', postObject);
    }

  }
})();