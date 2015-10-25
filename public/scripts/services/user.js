(function() {
  'use strict';
  angular
    .module('TwoCentzWeb')
    .factory('User', User);
    /* @ngInject */
    function User(CachedDataService) {
      var service = {
        getAllUserEntries : getAllUserEntries,
        getUserEntriesByTopicId: getUserEntriesByTopicId
      }

      return service;

      ///////////////////
      function getAllUserEntries() {
        return CachedDataService.getValue('/api/user/entries');
      };

      function getUserEntriesByTopicId(topicId) {
        return CachedDataService.getValue('/api/user/entries/' + topicId);
      };
    }

})();