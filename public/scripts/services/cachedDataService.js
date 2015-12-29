(function() {
  'use strict';

  /* @ngInject */
  function CachedDataService($http, $q, localStorageService, HelperService) {

    ///////////////////
    function useCache(){
      var cacheEnabled = 'false'; //turning cache off for now
      var cacheValue, urlParam;

      cacheValue = localStorageService.get('useCache');
      urlParam =  HelperService.getUrlParam('useCache');

      if(urlParam){
        cacheEnabled = urlParam;
      } else if (cacheValue){
        cacheEnabled = cacheValue;
      }

      localStorageService.set('useCache', cacheEnabled);

      if(cacheEnabled === 'true'){
        return true;
      } else {
        return false;
      }
    }

    function getValue(key){
      var deferred = $q.defer();
      var value = localStorageService.get(key);


      if(value && useCache()){
        deferred.resolve(value);
      } else {
        $http.get(key)
          .then(function(result) {
            localStorageService.set(key, result.data);
            deferred.resolve(result.data);
          }, function(reason){
            deferred.resolve(reason.data);
          });
      }
      return deferred.promise;
    }

    function postValue(url, postObject){
      var deferred = $q.defer();

      $http.post(url, postObject)
        .then(function(result) {
          deferred.resolve(result.data);
        }, function(reason){
          deferred.resolve(reason.data);
        });

      return deferred.promise;
    }

    function deleteValue(key){
      return localStorageService.remove(key);
    }

    function fetchFromCache(key){
      return localStorageService.get(key);
    }

    function storeInCache(key, value){
      localStorageService.set(key, value);
    }

    function clearAll(){
      return localStorageService.clearAll();
    }

    ////////////////////
    var service = {
      getValue : getValue,
      postValue: postValue,
      deleteValue: deleteValue,
      clearAll: clearAll,
      fetchFromCache: fetchFromCache,
      storeInCache: storeInCache
    }

    return service;

  }

  angular
    .module('TwoCentzWeb')
    .factory('CachedDataService', CachedDataService);


})();
