(function() {
  'use strict';
  angular
    .module('TwoCentzWeb')
    .filter('fromNow', function() {
      return function(date) {
        return moment(date).fromNow();
      }
    });
})();