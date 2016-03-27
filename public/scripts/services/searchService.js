/**
 * Created by Ilyas on 11/8/2015.
 */
(function() {
  'use strict';

  /* @ngInject */
  function SearchService($q, algolia) {


    ///////////////////
    function isEmpty(str) {
      return (!str || 0 === str.length);
    }

    function getIndex(){
      var ALGOLIA_CLIENT_ID = '05FTLLM54V';
      var ALGOLIA_SEARCH_KEY = '657c40e74e8a05261076878c1d08d093';
      var client = algolia.Client(ALGOLIA_CLIENT_ID, ALGOLIA_SEARCH_KEY);
      return client;
    }

    function search(key) {
      var ALGOLIA_INDEX_TOPICS = 'twocentz_topics';
      var deferred = $q.defer();
      if(isEmpty(key)){
        getIndex().search([{indexName:ALGOLIA_INDEX_TOPICS, query:'',params: {hitsPerPage: 25}}])
          .then(function searchSuccess(content) {
              deferred.resolve(content.results[0].hits);
          }, function searchFailure(err) {
              deferred.reject(err);
          });
      } else {
        getIndex().search([{indexName:ALGOLIA_INDEX_TOPICS, query:key, params: {hitsPerPage: 15}}])
          .then(function searchSuccess(content) {
              deferred.resolve(content.results[0].hits);
          }, function searchFailure(err) {
              deferred.reject(err);
          });
      }

      return deferred.promise;
    }
    ////////////////


    var service = {
      search: search
    }

    return service;

  }

  angular
    .module('TwoCentzWeb')
    .factory('SearchService', SearchService);

})();
