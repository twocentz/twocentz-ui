(function() {
  'use strict';
  angular
    .module('TwoCentzWeb')
    .controller('LoginCtrl', LoginController);

    /* @ngInject */
    function LoginController($scope) {
      document.title = "User Login - TwoCentz";
    }
})();