(function() {
  'use strict';
  angular
  .module('MyApp')
  .controller('NavbarCtrl', NavBarController);

  function NavBarController($scope, $aside) {
    var asideMenu =  $aside({scope: $scope, template: 'html/asideNavbar.html', show: false});
    $scope.showMenu = function(){
      asideMenu.$promise.then(function() {
        asideMenu.show();
      })
    };
  }
})();