(function() {
  'use strict';
	angular
    .module('TwoCentzWeb')
	  .controller('AddCtrl', AddController);
    /* @ngInject */
    function AddController($scope, $alert, Topic) {
      var vm = this;

      vm.user = {};

      // note, these field types will need to be
      // pre-defined. See the pre-built and custom templates
      // http://docs.angular-formly.com/v6.4.0/docs/custom-templates
      vm.userFields = [
        {
          key: 'email',
          type: 'input',
          templateOptions: {
            type: 'email',
            label: 'Email address',
            placeholder: 'Enter email'
          }
        },
        {
          key: 'password',
          type: 'input',
          templateOptions: {
            type: 'password',
            label: 'Password',
            placeholder: 'Password'
          }
        },
        {
          key: 'checked',
          type: 'checkbox',
          templateOptions: {
            label: 'Check me out'
          }
        }
      ];
	  }
})();