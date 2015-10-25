(function() {
  'use strict';
  angular
    .module('TwoCentzWeb')
    .controller('HomeCtrl', HomeController);

    /* @ngInject */
    function HomeController($scope, Topic) {
      
      document.title =  "TwoCentz - find opinions";

      $scope.categories = ['ALL', 'MOVIES', 'PRODUCTS', 'OTHERS'];
      $scope.headingTitle = 'Topics';
      /**
       * Filter by category on homepage.
       * @param category
       */
      $scope.filterByCategory = function(category) {
        if(category === "ALL"){
          $scope.categoryFilter = "";
           $scope.headingTitle = "Topics";
        }else{
          $scope.categoryFilter = category;
          $scope.headingTitle = category;
        }
      };

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