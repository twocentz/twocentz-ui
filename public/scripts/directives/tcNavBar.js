(function () {
  'use strict';

  function tcNavBar($user, SearchService) {

    function link(scope, element, attrs) {
      $user.get()
        .then(function(){
          scope.buttons = [{
            label: 'Create New',
            sref: 'add',
            icon: 'ion-plus'
          },
          {
            label: 'Profile',
            sref: 'mytopics',
            icon: 'ion-person'
          },
          {
            label: 'Home Page',
            sref: 'home',
            icon: 'ion-home'
          }];
        })
        .catch(function(){
          scope.buttons = [
          {
            label: 'Sign Up',
            sref: 'signup',
            icon: 'ion-paper-airplane'
          },
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
      },
      templateUrl: 'html/NavBar.html'
    };
    return directive;
  }

  angular
    .module('TwoCentzWeb')
    .directive('tcNavBar', tcNavBar);

})();
