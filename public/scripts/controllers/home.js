(function() {
  'use strict';
  angular
    .module('TwoCentzWeb')
    .controller('HomeCtrl', HomeController);

    /* @ngInject */
    function HomeController($scope, moment, SearchService) {
      
      document.title =  "TwoCentz - topics, reviews, opinions";

      $scope.search = search;

      function search(key) {
        SearchService.search(key)
          .then(function(hits){
            $scope.topics = hits;
          },function(err){
            console.log(err);
          })
      };


      function activate(){
        search(moment().format('MMMM YYYY'));
      };

      activate();
    }
})();