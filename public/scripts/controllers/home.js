(function() {
  'use strict';
  /* @ngInject */
  function HomeController($scope, moment, CachedDataService, SearchService, Topic) {

    document.title =  'TwoCentz - topics, reviews, opinions';
    function search(key) {
      if(key === CachedDataService.fetchFromCache('home-query')){
          $scope.topics = CachedDataService.fetchFromCache('home-topics');
      } else {
        SearchService.search(key)
          .then(function(hits){
            //saving to cache
            CachedDataService.storeInCache('home-topics', hits);
            CachedDataService.storeInCache('home-query', key);
            $scope.topics = hits;
          },function(err){
            //console.log(err);
          })
      }
    }

    $scope.$watch('query', function(newValue, oldValue) {
        if (newValue){
          search(newValue);
        }
    });


    function activate(){

      if(CachedDataService.fetchFromCache('home-query')){
        $scope.query = CachedDataService.fetchFromCache('home-query');
      } else {
        // initial search
        search();
      }
    }

    $scope.search = search;

    activate();

  }
  angular
    .module('TwoCentzWeb')
    .controller('HomeCtrl', HomeController);
})();
