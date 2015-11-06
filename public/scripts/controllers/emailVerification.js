(function() {
  'use strict';
  angular.module('TwoCentzWeb')
    .controller('VerifyCtrl', function($scope, Auth) {
      document.title = "Verify email - TwoCentz";
      $scope.verify = function() {
        Auth.verify({
          name: $scope.displayName,
          email: $scope.email,
          password: $scope.password
        });
      };
      $scope.pageClass = 'fadeZoom'
    });
})();