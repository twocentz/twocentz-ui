(function() {
  'use strict';

    /* @ngInject */
    function SignupController($scope) {
      document.title = 'Sign-up to TwoCentz';

    }

    angular
      .module('TwoCentzWeb')
      .controller('SignupCtrl', SignupController);
})();
