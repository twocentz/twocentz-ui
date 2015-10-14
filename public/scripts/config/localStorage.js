(function() {
  'use strict';
  angular
    .module('TwoCentzWeb')
    .config(function (localStorageServiceProvider) {
      localStorageServiceProvider
          .setPrefix('TwoCentzWeb')
          .setStorageType('sessionStorage')
    });
})();