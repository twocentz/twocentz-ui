(function() {
  'use strict';
  angular
    .module('MyApp')
    .factory('Entries', Entries);
    
    function Entries($http) {
      return {
        getMovieEntryById: function(id) {
          return $http.get('/api/movies/entries/' + id).then(function(result) {
            return result.data;
          }, function(reason){
            return reason.data;
          });
        },
        postEntriesByTopicId: function(text, topicId){
          var postObj = {
                          text: text,
                          topicId: topicId
                        };

          return $http.post('/api/entries/movies', postObj).then(function(result) {
            return result.data;
          }, function(reason){
            return reason.data;
          });
        }
      }
    }
})();