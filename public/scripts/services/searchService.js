/**
 * Created by Ilyas on 11/8/2015.
 */
(function() {
  'use strict';
  angular
      .module('TwoCentzWeb')
      .factory('SearchService', SearchService);

  /* @ngInject */
  function SearchService($q, algolia) {
    var service = {
      search: search
    }

    return service;

    ///////////////////

    function search(key) {
      var deferred = $q.defer();
      getIndex().search(key)
        .then(function searchSuccess(content) {
            deferred.resolve(content.hits);
        }, function searchFailure(err) {
            deferred.reject(err);
        });

      return deferred.promise;
    }

    function getIndex(){
      var ALGOLIA_CLIENT_ID = '05FTLLM54V';
      var ALGOLIA_SEARCH_KEY = '657c40e74e8a05261076878c1d08d093';
      var ALGOLIA_INDEX_NAME = 'twocentz_movies';


      var client = algolia.Client(ALGOLIA_CLIENT_ID, ALGOLIA_SEARCH_KEY);
      return client.initIndex(ALGOLIA_INDEX_NAME);
    }

  }
})();
