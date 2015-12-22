/**
 * Created by Ilyas on 11/8/2015.
 */
(function() {
  'use strict';
  angular
      .module('TwoCentzWeb')
      .constant("moment", moment)
      .constant("encode", encode)
      .constant("decode", decode);

  function encode(value) {
  	var unencoded = value;
  	return encodeURIComponent(unencoded).replace(/'/g,"%27").replace(/"/g,"%22");
  }
  function decode(value) {
  	var encoded = value;
  	return decodeURIComponent(encoded.replace(/\+/g,  " "));
  }

})();
