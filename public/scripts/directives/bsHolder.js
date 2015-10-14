(function() {
  'use strict';
  angular
    .module('TwoCentzWeb')
	  .directive('bsHolder', function() {
      return {
	      link: function (scope, element, attrs) {
	        Holder.run(element);
	      }
	    };
	  });
})();