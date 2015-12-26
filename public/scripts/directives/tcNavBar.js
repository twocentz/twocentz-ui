(function () {
  'use strict';

  angular
      .module('TwoCentzWeb')
      .directive('tcNavBar', tcNavBar);

  function tcNavBar($aside, SearchService) {
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

    function link(scope, element, attrs) {
      var asideMenu =  $aside({scope: scope, template: 'html/asideNavbar.html', show: false});
      scope.showMenu = function(){
        asideMenu.$promise.then(function() {
          asideMenu.show();
        })
      };
    }
  }

})();
