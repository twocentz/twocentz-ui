(function() {
  'use strict';
  angular
    .module('TwoCentzWeb')
    .controller('SignupCtrl', SignupController);
    /* @ngInject */
    function SignupController($scope) {
      document.title = "Sign-up to TwoCentz";

    }
})();