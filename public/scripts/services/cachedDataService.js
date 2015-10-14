(function() {
  'use strict';
  angular
      .module('TwoCentzWeb')
      .factory('CachedDataService', CachedDataService);

  function CachedDataService($http, $q, localStorageService) {
    var service = {
      getValue : getValue,
      postValue: postValue,
      deleteValue: deleteValue,
      clearAll: clearAll
    }

    return service;

    ///////////////////

    function getValue(key){
      var deferred = $q.defer();
      var value = localStorageService.get(key);

      if(value){
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

    function clearAll(){
      return localStorageService.clearAll();
    }
  }

})();