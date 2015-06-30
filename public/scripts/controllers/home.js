angular.module('MyApp')
  .controller('HomeCtrl', function($scope) {
    $scope.categories = ['Movies', 'Products'];
    $scope.headingTitle = 'Top TwoCentz Topics';
  });