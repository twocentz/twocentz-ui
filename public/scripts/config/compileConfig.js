(function() {
  'use strict';
  angular
    .module('TwoCentzWeb')
    .config(function ($compileProvider) {
       $compileProvider
          .aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|whatsapp):/);
    });
})();
