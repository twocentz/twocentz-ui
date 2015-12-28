(function() {
  'use strict';

    /* @ngInject */
    function User(CachedDataService) {


      ///////////////////
      function getAllUserEntries() {
        return CachedDataService.getValue('/api/user/entries');
      }

      function getUserEntriesByTopicId(topicId) {
        return CachedDataService.getValue('/api/user/entries/' + topicId);
      }
      ///////////////

      var service = {
        getAllUserEntries : getAllUserEntries,
        getUserEntriesByTopicId: getUserEntriesByTopicId
      }

      return service;
    }

    angular
      .module('TwoCentzWeb')
      .factory('User', User);

})();
