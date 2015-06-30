angular.module('MyApp')
  .controller('HomeCtrl', function($scope, Topic) {
    $scope.categories = ['MOVIES', 'PRODUCTS'];
    $scope.headingTitle = 'Top TwoCentz Topics';
    Topic.query(function(data) {
      $scope.topics = data;
    });
    $scope.filterByCategory = function(category) {
      $scope.topics = Topic.query({ category: category });
      $scope.headingTitle = category;
    };
  });