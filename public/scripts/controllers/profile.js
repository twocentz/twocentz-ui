(function() {
  'use strict';

  /* @ngInject */
  function ProfileController($scope, $stateParams, Topic) {
    document.title = 'User profile - TwoCentz';
	}

  angular
    .module('TwoCentzWeb')
    .controller('ProfileCtrl', ProfileController);
})();
