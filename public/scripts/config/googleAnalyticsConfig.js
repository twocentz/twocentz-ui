(function() {
  'use strict';
  angular
    .module('TwoCentzWeb')
    .run(function($rootScope, $location, $window){
      // initialise google analytics
      $window.ga('create', 'UA-72755711-1', 'auto');

       // track pageview on state change
       $rootScope.$on('$stateChangeSuccess', function (event) {
           $window.ga('send', 'pageview', $location.path());
       });
    })
})();
