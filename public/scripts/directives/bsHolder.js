(function() {
  'use strict';
  angular.module('MyApp')
	.directive('bsHolder', function() {
	   return {
	      link: function (scope, element, attrs) {
	        Holder.run(element);
	      }
	  };
	});
})();