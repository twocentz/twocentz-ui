angular.module('MyApp')
  .controller('HomeCtrl', function($scope, Topic) {
    //for debugging
    window.$scope = $scope;
    document.title =  "TwoCentz - let the world know";

    $scope.categories = ['MOVIES', 'PRODUCTS'];
    $scope.headingTitle = 'Topics';

    /**
     * Retrieve all topics from topic factory.
     */
    Topic.getAll().then(function(data) {
      $scope.topics = data;
    });

    /**
     * Filter by category on homepage.
     * @param category
     */
    $scope.filterByCategory = function(category) {
      $scope.categoryFilter = category.substring(0,category.length-1);
      $scope.headingTitle = category;
    };
  });