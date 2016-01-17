(function () {
  'use strict';

  function tcNavBar($user, SearchService) {

    function link(scope, element, attrs) {
      scope.buttons = [];
      $user.get()
        .then(function(){
          if(scope.page === 'movies' || scope.page === 'topic'){
            scope.editable = true;
          } else {
            scope.buttons =  scope.buttons.concat([
              {
                label: 'Create New',
                sref: 'add',
                icon: 'ion-plus'
              }]);
          }

          scope.buttons = scope.buttons.concat([
            {
              label: 'Profile',
              sref: 'mytopics',
              icon: 'ion-person'
            },
            {
              label: 'Home Page',
              sref: 'home',
              icon: 'ion-home'
            }]);
        })
        .catch(function(){
          scope.buttons = [
          {
            label: 'Sign in',
            sref: 'login',
            icon: 'ion-log-in'
          },
          {
            label: 'Home Page',
            sref: 'home',
            icon: 'ion-home'
          }];
        })

    }

    var directive = {
      restrict: 'EA',
      link: link,
      scope: {
        search: '=',
        query: '=',
        page: '@'
      },
      templateUrl: 'html/NavBar.html'
    };
    return directive;
  }

  angular
    .module('TwoCentzWeb')
    .directive('tcNavBar', tcNavBar);

})();
