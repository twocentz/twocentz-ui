(function() {
  'use strict';
  angular.module('MyApp')
    .controller('HomeCtrl', function($scope, Topic) {
      //for debugging
      window.$scope = $scope;
      document.title =  "TwoCentz - let the world know";

      $scope.categories = ['ALL', 'MOVIES', 'PRODUCTS', 'OTHERS'];
      $scope.headingTitle = 'Topics';

      /**
       * Retrieve all topics from topic factory.
       */
      Topic.getAll().then(function(data) {
        $scope.topics = data.content;
      });

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
  });
})();