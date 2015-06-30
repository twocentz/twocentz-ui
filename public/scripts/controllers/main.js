angular.module('MyApp')
  .controller('MainCtrl', function($scope) {
    $scope.categories = ['Movies', 'Products'];
    $scope.headingTitle = 'Top 12 Shows';
  });