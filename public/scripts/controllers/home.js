(function() {
  'use strict';
  angular
    .module('TwoCentzWeb')
    .controller('HomeCtrl', HomeController);

    /* @ngInject */
    function HomeController($scope, moment, SearchService, Topic) {

      document.title =  "TwoCentz - topics, reviews, opinions";

      //$scope.search = search;

      // function search(key) {
      //   SearchService.search(key)
      //     .then(function(hits){
      //       $scope.topics = hits;
      //     },function(err){
      //       console.log(err);
      //     })
      // };
      //
      //
      // function activate(){
      //   search(moment().format('MMMM YYYY'));
      // };

      function displayTopics(){
       return Topic.getAll().then(function(data) {
         $scope.topics = data.content;
         return $scope.topics;
       });
     };

     function activate(){
       return displayTopics().then(function(){
         //console.log("when rendering is finally called");
       });
     };

      activate();
    }
})();
