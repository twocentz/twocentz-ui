(function() {
  'use strict';
  /* @ngInject */
  function HomeController($scope, moment, SearchService, Topic) {

    document.title =  'TwoCentz - topics, reviews, opinions';

    function search(key) {
      SearchService.search(key)
        .then(function(hits){
          $scope.topics = hits;
        },function(err){
          console.log(err);
        })
    }


    function activate(){
      search(moment().format('MMMM YYYY'));
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
