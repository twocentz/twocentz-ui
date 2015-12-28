/**
 * Created by Ilyas on 11/8/2015.
 */
(function() {
  'use strict';
    /* jshint ignore:start */
  function encode(value) {
  	var unencoded = value;
  	return encodeURIComponent(unencoded).replace(/'/g,"%27").replace(/"/g,"%22");
  }


  angular
    .module('TwoCentzWeb')
    .constant('moment', moment)
    .constant('encode', encode);
  /* jshint ignore:end */
})();
