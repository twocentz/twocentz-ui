(function() {
  'use strict';
  /* @ngInject */
  function HomeController($scope, moment, CachedDataService, SearchService, Topic) {

    document.title =  'TwoCentz - topics, reviews, opinions';

    function search(key) {
      if(key === CachedDataService.fetchFromCache('home-query')){
          $scope.topics = CachedDataService.fetchFromCache('home-movies');
      } else {
        SearchService.search(key)
          .then(function(hits){
            //saving to cache
            CachedDataService.storeInCache('home-movies', hits);
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
      //cleanup DOM
      $('.modal, .modal-backdrop').remove();

      if(CachedDataService.fetchFromCache('home-query')){
        $scope.query = CachedDataService.fetchFromCache('home-query');
      } else {
        // initial based on date
        search(moment().format('MMMM YYYY'));
      }
    }

    $scope.search = search;

    activate();

  //   function displayTopics(){
  //    return Topic.getAll().then(function(data) {
  //      $scope.topics = data.content;
  //      return $scope.topics;
  //    });
  //  };
   //
  //  function activate(){
  //    return displayTopics().then(function(){
  //      //console.log("when rendering is finally called");
  //    });
  //  };


  }
  angular
    .module('TwoCentzWeb')
    .controller('HomeCtrl', HomeController);
})();
