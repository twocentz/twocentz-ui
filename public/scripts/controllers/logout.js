(function() {
  'use strict';

  /* @ngInject */
  function LogoutController($scope, $auth) {
    $auth.endSession();
	}
	
  angular
    .module('TwoCentzWeb')
    .controller('LogoutCtrl', LogoutController);
})();
