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
      var ALGOLIA_INDEX_NAME = 'twocentz_movies';


      var client = algolia.Client(ALGOLIA_CLIENT_ID, ALGOLIA_SEARCH_KEY);
      return client.initIndex(ALGOLIA_INDEX_NAME);
    }

    function search(key) {
      var deferred = $q.defer();
      //if empty string
      var startDate = moment().subtract(2, 'months').unix() * 1000;
      var endDate = moment().add(2, 'months').unix() * 1000;
      if(isEmpty(key)){
        getIndex().search('', {'numericFilters': [
          'props.releaseDate:' + startDate + ' to ' + endDate +'']}
        )
          .then(function searchSuccess(content) {
              deferred.resolve(content.hits);
          }, function searchFailure(err) {
              deferred.reject(err);
          });
      } else {
        getIndex().search(key)
          .then(function searchSuccess(content) {
              deferred.resolve(content.hits);
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
