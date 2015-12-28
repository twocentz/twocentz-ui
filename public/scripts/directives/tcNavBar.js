(function () {
  'use strict';
  
  function tcNavBar($aside, SearchService) {

    function link(scope, element, attrs) {
      var asideMenu =  $aside({scope: scope, template: 'html/asideNavbar.html', show: false});
      scope.showMenu = function(){
        asideMenu.$promise.then(function() {
          asideMenu.show();
        })
      };
    }

    var directive = {
      restrict: 'EA',
      link: link,
      scope: {
        search: '=',
        query: '=',
      },
      templateUrl: 'html/NavBar.html'
    };
    return directive;
  }

  angular
    .module('TwoCentzWeb')
    .directive('tcNavBar', tcNavBar);

})();
