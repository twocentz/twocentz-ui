(function() {
  'use strict';
  angular
    .module('TwoCentzWeb')
    .controller('ProfileCtrl', ProfileController);
  /* @ngInject */
  function ProfileController($scope, $stateParams, Topic) {
    document.title = "User profile - TwoCentz";
	}
})();