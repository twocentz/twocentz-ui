(function() {
  'use strict';
  angular
    .module('TwoCentzWeb')
    .factory('User', User);

    function User($http) {
      var service = {
        getAllUserEntries : getAllUserEntries,
        getUserEntriesByTopicId: getUserEntriesByTopicId
      }

      return service;

      ///////////////////
      function getAllUserEntries() {
        return $http.get('/api/user/entries').then(function(result) {
          return result.data;
        }, function(reason){
          return reason.data;
        });
      };

      function getUserEntriesByTopicId(topicId) {
        return $http.get('/api/user/entries/' + topicId).then(function(result) {
          return result.data;
        }, function(reason){
          return reason.data;
        })
      };
    }

})();