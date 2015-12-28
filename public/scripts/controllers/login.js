(function() {
  'use strict';
  /* @ngInject */
  function LoginController($scope) {
    document.title = 'User Login - TwoCentz';
  }
  
  angular
    .module('TwoCentzWeb')
    .controller('LoginCtrl', LoginController);
})();
